import createEdgeClient from "../_shared/edge-client.ts";

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

Deno.serve(async (req) => {
  const supabase = createEdgeClient(req);
  if (req.method === "OPTIONS") {
    //Cors preflight
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*", //later restrict to domains
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, x-client-info, x-supabase-auth-token, X-Requested-With, Accept, Origin, apikey",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (req.method === "POST") {
    const { message, subject } = await req.json();

    //fetching push tokens
    const { data: userProfiles, error } = await supabase
      .from("profiles")
      .select("expo_push_token")
      .neq("expo_push_token", "");

    if (error || !userProfiles) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch push tokens" }),
        { status: 400 },
      );
    }

    const notifications = userProfiles.map((
      { expo_push_token }: ProfileData,
    ) => ({
      to: expo_push_token,
      sound: "default",
      body: message,
      data: { message },
      title: subject,
    }));

    //send notif
    const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notifications),
    });

    if (!expoResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send notifications" }),
        { status: 400 },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, x-client-info, x-supabase-auth-token, X-Requested-With, Accept, Origin, apikey",
      },
    });
  }

  return new Response(JSON.stringify({ error: "Invalid request method" }), {
    status: 405,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-client-info, x-supabase-auth-token, X-Requested-With, Accept, Origin, apikey",
    },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notif' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
