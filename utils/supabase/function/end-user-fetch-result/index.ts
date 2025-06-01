import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@/utils/supabase/server";
import  { type NextRequest, NextResponse } from "next/server";

// CORS対策
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "*";
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
    },
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const url: URL = new URL(req.url);
  const mondaiAnswerHistoryIds = url.searchParams.get("mondaiAnswerHistoryIds");
  if (!mondaiAnswerHistoryIds) {
    return NextResponse.json(
      { error: "mondaiAnswerHistoryIds is required" },
      { status: 400 }
    );
  }
  const mondaiHistoryIdsArray = `{${mondaiAnswerHistoryIds
    .replace(/\[|\]/g, "")
    .split(",")
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .join(",")}}`;

  try {
    const { data, error } = await supabase.rpc("end_user_fetch_result", {
      param_mondai_history_ids: mondaiHistoryIdsArray,
    });

    if (error) {
      throw new Error(`Error: ${error.message}`);
    }

    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      },
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      },
    );
  }
}
