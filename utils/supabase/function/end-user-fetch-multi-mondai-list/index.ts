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

    return optionalResponse(JSON.stringify({ data }), 200);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});
