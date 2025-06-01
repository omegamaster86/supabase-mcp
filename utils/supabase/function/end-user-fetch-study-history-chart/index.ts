import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@/utils/supabase/server";
import  { type NextRequest, NextResponse } from "next/server";

// CORS対策
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "*";
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
  const supabaseAuthUserId= url.searchParams.get("supabaseAuthUserId");
  const testYearAndType = url.searchParams.get("testYearAndType");
  const subject = url.searchParams.has("subject") ? url.searchParams.get("subject") : null;
  const importanceType = url.searchParams.has("importanceType") ? url.searchParams.get("importanceType") : null;

  try {
    const { data, error } = await supabase.rpc(
      "end_user_fetch_study_history_chart", 
      {
        param_supabase_auth_user_id: supabaseAuthUserId,
        param_test_year_and_type: testYearAndType,
        param_subject: subject,
        param_importance_type: importanceType,
      }
    );

    if (error) {
      throw new Error(`Error: ${error.message}`);
    }

    const [result] = data;
    return optionalResponse(JSON.stringify(result), 200);
  } catch (error) {
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});