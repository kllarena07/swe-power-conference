import { Href } from "expo-router";
import { supabase } from "./supabase";

export type LogoutRedirect = {
  type: "error" | "success";
  path: Href;
  message: string;
};

export const logoutAction = async (): Promise<LogoutRedirect> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      type: "error",
      path: "/",
      message: error.message,
    };
  }

  return {
    type: "success",
    path: "/",
    message: "Successfully logged out",
  };
};
