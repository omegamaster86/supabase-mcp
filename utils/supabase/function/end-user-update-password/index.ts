import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

// CORS対策
const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN");
const optionalResponse = (optionalBody: string | null, optionalStatus: number) => {
  return new Response(optionalBody, {
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    },
    status: optionalStatus,
  });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return optionalResponse(null, 204);
  }

  try {
    const { email, newPassword } = await req.json();

    // m_userテーブルからsupabase_auth_user_idを取得
    const { data: userData, error: selectError } = await supabase
      .from("m_user")
      .select("supabase_auth_user_id")
      .eq("email", email)
      .limit(1)
      .single();

    if (selectError || !userData) {
      throw new Error(selectError?.message || "該当ユーザなし");
    }

    // パスワードを更新
    const { data, error } = await supabase.auth.admin.updateUserById(
      userData.supabase_auth_user_id,
      { password: newPassword }
    );

    if (error) {
      throw new Error(error.message);
    }

    return optionalResponse(JSON.stringify({}), 200);
  } catch (error) {
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});
