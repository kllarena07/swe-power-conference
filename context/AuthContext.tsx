import { supabase } from "@/utils/supabase";
import { Session, User } from "@supabase/supabase-js";
import { Href } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProps {
  user: User | undefined;
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

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<AuthProps["user"] | undefined>(undefined);

  const [session, setSession] = useState<Session | null>(null);

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
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

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

    return {
      type: "success",
      path: "/login",
      message: "Successfully logged out",
    };
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
