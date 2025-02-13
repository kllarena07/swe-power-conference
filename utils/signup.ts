import { supabase } from "./supabase";

export type SignUpActionProps = {
  name: string;
  email: string;
  password: string;
};

export const signUpAction = async ({
  name,
  email,
  password,
}: SignUpActionProps) => {
  if (!email || !password) {
    console.error("Email and password are required");
    return;
  }

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
  } else {
    console.log(
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};
