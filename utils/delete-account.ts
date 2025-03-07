import { supabase } from "./supabase";

export async function deleteUserAccount(): Promise<
  { success: boolean; message: string }
> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.functions.invoke("delete-user", {
      body: JSON.stringify({ user_id: user?.id }),
    });

    if (error) {
      console.error("Error deleting user:", error);
      return { success: false, message: `Error deleting account. ${error}` };
    } else {
      console.log("User deleted successfully");
    }

    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Error: ${errorMessage}` };
  }
}
