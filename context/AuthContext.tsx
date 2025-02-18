// import { supabase } from "@/utils/supabase";
// import { Session, User } from "@supabase/supabase-js";
// import { Href } from "expo-router";
// import { createContext, useContext, useEffect, useState } from "react";

// interface AuthProps {
//   user: User | undefined;
//   onLogin: (email: string, password: string) => Promise<ActionRedirect>;
//   onLogout: () => Promise<ActionRedirect>;
// }

// const AuthContext = createContext<Partial<AuthProps>>({});

// export type ActionRedirect = {
//   type: "error" | "success";
//   path: Href;
//   message: string;
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }: any) => {
//   const [user, setUser] = useState<AuthProps["user"] | undefined>(undefined);

//   const [session, setSession] = useState<Session | null>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(async ({ data: { session } }) => {
//       setSession(session);
//       if (session?.user) {
//         setUser(session.user);
//       }
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (_event, session) => {
//       setSession(session);
//       if (session?.user) {
//         setUser(session.user);
//       } else {
//         setUser(undefined);
//       }
//     });

//     return () => subscription?.unsubscribe();
//   }, []);

//   const login = async (
//     email: string,
//     password: string
//   ): Promise<ActionRedirect> => {
//     if (!email || !password) {
//       return {
//         type: "error",
//         path: "/login",
//         message: "Email and password are required",
//       };
//     }

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       return {
//         type: "error",
//         path: "/login",
//         message: error.message,
//       };
//     }

//     setUser(data.user);

//     return {
//       type: "success",
//       path: "/(protected)",
//       message: "Successfully logged in",
//     };
//   };

//   const logout = async (): Promise<ActionRedirect> => {
//     const { error } = await supabase.auth.signOut();

//     if (error) {
//       return {
//         type: "error",
//         path: "/",
//         message: error.message,
//       };
//     }

//     setUser(undefined);

//     return {
//       type: "success",
//       path: "/login",
//       message: "Successfully logged out",
//     };
//   };

//   const value = {
//     onLogin: login,
//     onLogout: logout,
//     user,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import { supabase } from "@/utils/supabase";
import { Session, User } from "@supabase/supabase-js";
import { Href } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

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

interface AuthProps {
  user: User | undefined;
  profileData: ProfileData | undefined;
  onLogin: (email: string, password: string) => Promise<ActionRedirect>;
  onLogout: () => Promise<ActionRedirect>;
}

const AuthContext = createContext<Partial<AuthProps>>({});

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

  // Fetch the current session on mount and subscribe to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(undefined);
        setProfileData(undefined); // Reset profile data on logout
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Fetch and subscribe to the profile data for the logged-in user
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfileData = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfileData(data);
      }
    };

    fetchProfileData();

    const channel = supabase
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
          if (payload.eventType === "UPDATE") {
            setProfileData(payload.new as ProfileData);
          }
        }
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [user?.id]);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
