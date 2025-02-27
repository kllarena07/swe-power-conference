import { supabase } from "@/utils/supabase";
import { RealtimeChannel, Session, User } from "@supabase/supabase-js";
import { Href } from "expo-router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// Define the shape of the profile data
export type ProfileData = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  points: number;
  checked_in: boolean;
  is_admin: boolean;
  expo_push_token: string;
  user_id: string;
};

// Define the authentication status
export type AuthStatus =
  | "initializing" // App is checking for existing session
  | "authenticated" // User is logged in
  | "unauthenticated" // User is not logged in
  | "error"; // Error occurred during authentication

interface AuthProps {
  user: User | undefined;
  profileData: ProfileData | undefined;
  accessToken: string | undefined;
  authStatus: AuthStatus;
  authError: Error | null;
  isLoading: boolean;
  onLogin: (email: string, password: string) => Promise<ActionRedirect>;
  onLogout: () => Promise<ActionRedirect>;
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<Partial<AuthProps>>({
  authStatus: "initializing",
  isLoading: true,
  authError: null,
});

// Helper function to create a promise with timeout
const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(errorMessage));
      }, timeoutMs);
    }),
  ]);
};

// Debug logger function
const logDebug = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[AuthContext] ${message}`, data || "");
  }
};

export type ActionRedirect = {
  type: "error" | "success";
  path: Href;
  message: string;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [profileData, setProfileData] = useState<ProfileData | undefined>(
    undefined
  );
  const [session, setSession] = useState<Session | null>(null);
  const [accessToken, setAccessToken] = useState<
    Session["access_token"] | undefined
  >(undefined);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("initializing");
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const AUTH_TIMEOUT = 10000; // 10 seconds timeout for auth operations

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      logDebug("Starting authentication initialization");
      setIsLoading(true);
      setAuthStatus("initializing");

      // Clear any previous errors
      setAuthError(null);

      // Attempt to get session with timeout
      const sessionResult = await withTimeout(
        supabase.auth.getSession(),
        AUTH_TIMEOUT,
        "Authentication request timed out"
      );

      logDebug(
        "Retrieved session",
        sessionResult?.data?.session ? "Session found" : "No session"
      );

      const {
        data: { session },
      } = sessionResult;

      setSession(session);
      setAccessToken(session?.access_token);

      if (session?.user) {
        logDebug("User found in session", { userId: session.user.id });
        setUser(session.user);
        setAuthStatus("authenticated");
      } else {
        logDebug("No authenticated user found");
        setAuthStatus("unauthenticated");
      }
    } catch (error) {
      const err = error as Error;
      logDebug("Error initializing auth", err.message);
      setAuthError(err);
      setAuthStatus("error");

      // Reset user state on error
      setUser(undefined);
      setProfileData(undefined);
      setAccessToken(undefined);

      // Attempt retry if under max retries
      if (retryCount < MAX_RETRIES) {
        logDebug(
          `Retrying auth initialization (${retryCount + 1}/${MAX_RETRIES})`
        );
        setRetryCount((prev) => prev + 1);

        // Exponential backoff for retries
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 8000);
        setTimeout(() => {
          initializeAuth();
        }, backoffTime);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  // Method to manually retry authentication
  const retryAuth = useCallback(async () => {
    logDebug("Manual retry of authentication requested");
    setRetryCount(0);
    await initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Initialize auth when component mounts
    initializeAuth();

    // Set up auth state change listener
    let subscription: { unsubscribe: () => void } | null = null;

    try {
      logDebug("Setting up auth state change listener");
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          logDebug("Auth state changed", _event);

          setSession(session);
          setAccessToken(session?.access_token);

          if (session?.user) {
            logDebug("User authenticated", { userId: session.user.id });
            setUser(session.user);
            setAuthStatus("authenticated");
          } else {
            logDebug("User signed out");
            setUser(undefined);
            setProfileData(undefined);
            setAccessToken(undefined);
            setAuthStatus("unauthenticated");
          }
        }
      );

      subscription = data.subscription;
    } catch (error) {
      const err = error as Error;
      logDebug("Error setting up auth listener", err.message);
      setAuthError(err);
    }

    return () => {
      if (subscription) {
        logDebug("Cleaning up auth state listener");
        subscription.unsubscribe();
      }
    };
  }, [initializeAuth]);

  useEffect(() => {
    if (!user?.id) return;

    if (session) setAccessToken(session.access_token);

    let isMounted = true;
    let retries = 0;
    const MAX_PROFILE_RETRIES = 3;

    const fetchProfileData = async () => {
      if (!isMounted) return;

      try {
        logDebug("Fetching profile data", { userId: user.id });
        setIsLoading(true);

        const result = await withTimeout(
          Promise.resolve().then(() =>
            supabase
              .from("profiles")
              .select("*")
              .eq("user_id", user.id)
              .single()
          ),
          AUTH_TIMEOUT,
          "Profile fetch request timed out"
        );

        const { data, error } = result;

        if (!isMounted) return;

        if (error) {
          logDebug("Error fetching profile", error);
          console.error("Error fetching profile:", error);

          // Retry logic with exponential backoff
          if (retries < MAX_PROFILE_RETRIES) {
            retries++;
            const backoffTime = Math.min(1000 * Math.pow(2, retries), 8000);
            logDebug(
              `Retrying profile fetch (${retries}/${MAX_PROFILE_RETRIES}) in ${backoffTime}ms`
            );

            setTimeout(fetchProfileData, backoffTime);
          }
          return;
        }

        if (data) {
          logDebug("Profile data retrieved successfully");
          setProfileData(data);
        } else {
          logDebug("No profile data found");
        }
      } catch (error) {
        if (!isMounted) return;

        const err = error as Error;
        logDebug("Unexpected error fetching profile", err.message);
        console.error("Unexpected error fetching profile:", err);

        // Retry on network errors
        if (
          retries < MAX_PROFILE_RETRIES &&
          (err.message.includes("network") || err.message.includes("timeout"))
        ) {
          retries++;
          const backoffTime = Math.min(1000 * Math.pow(2, retries), 8000);
          logDebug(
            `Retrying after error (${retries}/${MAX_PROFILE_RETRIES}) in ${backoffTime}ms`
          );

          setTimeout(fetchProfileData, backoffTime);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();

    // Set up realtime subscription for profile changes
    let channel: RealtimeChannel;
    try {
      logDebug("Setting up profile changes subscription");
      channel = supabase
        .channel("profile-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            logDebug("Received profile update", payload.eventType);
            if (payload.eventType === "UPDATE" && isMounted) {
              setProfileData(payload.new as ProfileData);
            }
          }
        )
        .subscribe();
    } catch (error) {
      const err = error as Error;
      logDebug("Error setting up profile subscription", err.message);
      console.error("Error setting up profile subscription:", err);
    }

    return () => {
      logDebug("Cleaning up profile effect");
      isMounted = false;
      if (channel) {
        logDebug("Unsubscribing from profile changes");
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, session]);

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<ActionRedirect> => {
    if (!email || !password) {
      return {
        type: "error",
        path: "/login",
        message: "Email and password are required",
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        type: "error",
        path: "/login",
        message: error.message,
      };
    }

    setUser(data.user);

    return {
      type: "success",
      path: "/(protected)",
      message: "Successfully logged in",
    };
  };

  // Logout function
  const logout = async (): Promise<ActionRedirect> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        type: "error",
        path: "/",
        message: error.message,
      };
    }

    setUser(undefined);
    setProfileData(undefined);
    setAccessToken(undefined);

    return {
      type: "success",
      path: "/login",
      message: "Successfully logged out",
    };
  };

  // Provide auth functions, user, and profile data via context
  const value = {
    onLogin: login,
    onLogout: logout,
    user,
    profileData,
    accessToken,
    authStatus,
    authError,
    isLoading,
    retryAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
