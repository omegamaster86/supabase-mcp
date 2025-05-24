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
  const {
    supabaseAuthUserId,
    testYearAndType,
    mondaiAnswerHistoryid,
    bookmarkValue,
  } = await req.json();

  try {
    const { error } = await supabase.rpc("end_user_update_bookmark", {
      param_supabase_auth_user_id: supabaseAuthUserId,
      param_test: testYearAndType,
      param_mondai_answer_history_id: mondaiAnswerHistoryid,
      param_bookmark_value: bookmarkValue,
    });

    if (error) {
      throw new Error(`Error: ${error.message}`);
    }

    return optionalResponse(JSON.stringify({}), 200);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});
