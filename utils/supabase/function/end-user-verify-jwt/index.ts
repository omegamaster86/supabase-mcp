import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS対策
const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN");
const optionalResponse = (optionalBody, optionalStatus) => {
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
    // AuthorizationヘッダーからJWTを抽出
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization header is missing or malformed.");
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      throw new Error("JWT is missing from the Authorization header.");
    }

    // Supabaseクライアントをトークン付きで初期化
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      {
        global: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      }
    );

    // リクエストボディからrefreshTokenを取得
    const { refreshToken } = await req.json();

    // Supabaseセッションのリフレッシュ
    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
    if (refreshError) {
      throw new Error(`refreshSession error: ${refreshError.message}`);
    }

    const {
      access_token: newAccessToken,
      expires_at: expiresAt,
      refresh_token: newRefreshToken,
    } = refreshData.session;

    // 成功レスポンスを返す
    return optionalResponse(
      JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: expiresAt,
      }),
      200
    );
  } catch (error) {
    console.error("Error:", error.message);
    return optionalResponse(JSON.stringify({ error: error.message }), 401);
  }
});
