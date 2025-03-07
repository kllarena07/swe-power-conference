// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.44.4";

// Create a Supabase client with the service role key for admin operations
const createAdminClient = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

console.log("Delete User Function initialized");

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, x-client-info, x-supabase-auth-token, X-Requested-With, Accept, Origin, apikey",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-client-info, x-supabase-auth-token, X-Requested-With, Accept, Origin, apikey",
    "Content-Type": "application/json",
  };

  // Only allow POST requests for the user deletion endpoint
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed. Only POST requests are supported.",
      }),
      {
        status: 405,
        headers: corsHeaders,
      },
    );
  }

  try {
    // Create clients - regular client for data operations and admin client for auth operations
    const adminClient = createAdminClient();

    // Parse request body
    const { user_id } = await req.json();

    // Validate request
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    console.log(user_id);
    console.log(adminClient);

    const { error: deleteProfileError } = await adminClient
      .from("profiles")
      .delete()
      .eq("user_id", user_id);

    if (deleteProfileError) {
      console.error("Error deleting profile:", deleteProfileError);
      return new Response(
        JSON.stringify({ error: "Failed to delete associated profile" }),
        { status: 500, headers: corsHeaders },
      );
    }

    // Delete the user from Auth
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
      user_id,
    );

    if (deleteUserError) {
      console.error(deleteUserError);
      return new Response(
        JSON.stringify({
          error: `Failed to delete user: ${deleteUserError.message}`,
        }),
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "User deleted successfully",
        user_id: user_id,
      }),
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error(
      "Error in delete-user function:",
      error instanceof Error ? error.message : error,
    );

    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
});
