import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
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
    const { supabaseAuthUserId, newPassword } = await req.json();

    // パスワードを更新
    const { data, error } = await supabase.auth.admin.updateUserById(
      supabaseAuthUserId,
      { password: newPassword }
    );

    if (error) {
      throw new Error(error.message);
    }

    // m_userテーブルのinitial_password_use_flagをfalseに更新
    const { error: updateError } = await supabase
      .from("m_user")
      .update({ initial_password_use_flag: false })
      .eq("supabase_auth_user_id", supabaseAuthUserId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return optionalResponse(JSON.stringify({}), 200);
  } catch (error) {
    return optionalResponse(JSON.stringify({ error: error.message }), 500);
  }
});
