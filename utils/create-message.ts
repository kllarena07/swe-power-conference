import { supabase } from "./supabase";

export async function createMessage(
  { title, description }: { title: string; description: string },
) {
  const { error } = await supabase
    .from("messages")
    .insert([
      {
        title,
        description,
      },
    ])
    .select();

  if (error) {
    throw error;
  }
}
