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


export const onRequest = async (req: Request) => {
  const supabase = await createClient();
  if (req.method === "OPTIONS") {
    return optionalResponse(null, 204);
  }
  const {
    supabaseAuthUserId,
    testYearAndType,
    mondaiFormatType,
    subject,
    chapter,
    category,
    importanceType,
    calledFrom,
    bookmark,
  } = await req.json();
  try {
    const { data, error } = await supabase.rpc(
      "end_user_fetch_importance_and_bookmark_and_count", {
        param_supabase_auth_user_id: supabaseAuthUserId,
        param_test: testYearAndType,
        param_mondai_format_type: mondaiFormatType,
        param_subject: subject,
        param_chapter: chapter,
        param_category: category,
        param_importance: importanceType,
        param_from: calledFrom,
        param_bookmark: bookmark,
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
