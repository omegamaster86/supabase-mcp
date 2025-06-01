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

  try {
    const {
      supabaseAuthUserId,
      testYearAndType,
      subject,
      chapter,
      category,
      importanceType,
      mondaiCount,
      bookmark,
      mondaiFilterByLearningHistory
    } = await req.json();

    // "null" を null に変換
    const parsedSubject = subject === "null" ? null : subject;
    const parsedChapter = chapter === "null" ? null : chapter;
    const parsedCategory = category === "null" ? null : category;
    const parsedImportance = importanceType === "null" ? null : importanceType;

    const documentUuid = crypto.randomUUID();

    const { data, error } = await supabase.rpc("end_user_fetch_multi_mondai_list", {
      param_supabase_auth_user_id: supabaseAuthUserId,
      param_test: testYearAndType,
      param_subject: parsedSubject,
      param_chapter: parsedChapter,
      param_category: parsedCategory,
      param_importance: parsedImportance,
      param_mondai_count: mondaiCount,
      param_bookmark_flag: bookmark,
      param_document_uuid: documentUuid,
      param_mondai_filter_by_learning_history: mondaiFilterByLearningHistory,
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