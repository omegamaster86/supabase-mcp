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
  const url: URL = new URL(req.url);
  const mondaiAnswerHistoryIds = url.searchParams.get("mondaiAnswerHistoryIds");

  // []を削除して、配列に変換
  const mondaiHistoryIdsArray = `{${mondaiAnswerHistoryIds
    .replace(/\[|\]/g, "")
    .split(",")
    .map(Number)
    .filter((n) => !isNaN(n))
    .join(",")}}`;

  try {
    const { data, error } = await supabase.rpc("end_user_fetch_result", {
      param_mondai_history_ids: mondaiHistoryIdsArray,
    });

    if (error) {
      throw new Error(`Error: ${error.message}`);
    }

    return optionalResponse(JSON.stringify({ data }), 200);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});
