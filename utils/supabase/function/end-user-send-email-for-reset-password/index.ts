import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@/utils/supabase/server";
// CORS対策
const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN");
const optionalResponse = (optionalBody: string, optionalStatus: number) => {
  return new Response(optionalBody, {
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
    },
    status: optionalStatus,
  });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return optionalResponse(null, 204);
  }
  try {
    const { email } = await req.json();

    //メールを送る
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(`Error: ${error.message}`);
    }

    return optionalResponse(JSON.stringify({ data }), 200);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});
