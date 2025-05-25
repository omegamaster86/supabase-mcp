import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@/utils/supabase/server";

// CORS対策
const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN");
const optionalResponse = (
  optionalBody: string | null,
  optionalStatus: number
) => {
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
  try {
    if (req.method === "OPTIONS") {
      return optionalResponse(null, 204);
    }
    const { studentNo, passWord } = await req.json();

    //受講生番号からメールアドレスとパスワード使用フラグを取得
    const { data: fetchedData, error: fetchingError } = await supabase.rpc(
      "fetch_email_and_initial_password_use_flag_by_student_no",
      { param_student_no: studentNo }
    );
    if (fetchingError) {
      throw new Error(fetchingError.message);
    }
    if (!fetchedData || fetchedData.length === 0) {
      throw new Error("該当ユーザが見つかりません");
    }
    const { email, initial_password_use_flag: initialPasswordUseFlag } =
      fetchedData[0];

    // 認証処理
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: passWord,
      });
    if (authError) {
      throw new Error(authError.message);
    }

    return optionalResponse(
      JSON.stringify({
        supabaseAuthUserId: authData.user.id,
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at,
        initialPasswordUseFlag: initialPasswordUseFlag,
      }),
      200
    );
  } catch (error) {
    console.error("Error:", error.message || error);
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});
