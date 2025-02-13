import { Href } from "expo-router";
import { supabase } from "./supabase";

export type LoginActionProps = {
  email: string;
  password: string;
};

export type LoginRedirect = {
  type: "error" | "success";
  path: Href;
  message: string;
};

export const loginAction = async ({
  email,
  password,
}: LoginActionProps): Promise<LoginRedirect> => {
  if (!email || !password) {
    return {
      type: "error",
      path: "/login",
      message: "Email and password are required",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
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

  return {
    type: "success",
    path: "/protected/(tabs)",
    message: "Successfully logged in",
  };
};
