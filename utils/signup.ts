import { Href } from "expo-router";
import { supabase } from "./supabase";

export type SignUpActionProps = {
  name: string;
  email: string;
  password: string;
  expoPushToken: string;
};

export type SignUpRedirect = {
  type: "error" | "success";
  path: Href;
  message: string;
};

export const signUpAction = async ({
  name,
  email,
  password,
  expoPushToken,
}: SignUpActionProps): Promise<SignUpRedirect> => {
  if (!email || !password) {
    return {
      type: "error",
      path: "/signup",
      message: "Email and password are required",
    };
  }

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo:
        "https://ffzljrapzzjpcjsfupeh.supabase.co/functions/v1/email-verified",
      data: {
        name: name,
        expo_push_token: expoPushToken,
      },
    },
  });

  if (error) {
    return {
      type: "error",
      path: "/signup",
      message: error.message,
    };
  } else {
    return {
      type: "success",
      path: "/login",
      message:
        "Thanks for signing up! Please check your email for a verification link.",
    };
  }
};
