import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_ANON_KEY")
);

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
  const url: URL = new URL(req.url);
  const supabaseAuthUserId = url.searchParams.get("supabaseAuthUserId");

  try {
    const { data, error } = await supabase.rpc(
      "end_user_fetch_tests_and_initial_test_and_importance_and_count",
      {
        param_supabase_auth_user_id: supabaseAuthUserId,
      }
    );

    if (error) {
      throw new Error(`Error: ${error.message}`);
    }

    return optionalResponse(JSON.stringify({ data }), 200);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});
