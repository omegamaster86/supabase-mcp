import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest) {
	const supabase = await createClient();

	const { searchParams } = new URL(req.url);
	const supabaseAuthUserId = searchParams.get("supabaseAuthUserId");

	if (!supabaseAuthUserId) {
		return NextResponse.json(
			{ error: "supabaseAuthUserId is required" },
			{
				status: 400,
				headers: {
					"Access-Control-Allow-Origin": allowedOrigin,
				},
			},
		);
	}

	try {
		const { data, error } = await supabase.rpc(
			"end_user_fetch_tests_and_initial_test_and_importance_and_count",
			{
				param_supabase_auth_user_id: supabaseAuthUserId,
			},
		);
		if (error) throw new Error(error.message);

		return NextResponse.json(
			{ data },
			{
				status: 200,
				headers: {
					"Access-Control-Allow-Origin": allowedOrigin,
				},
			},
		);
	} catch (err: unknown) {
		const errorMessage =
			err instanceof Error ? err.message : "Unknown error occurred";
		return NextResponse.json(
			{ error: errorMessage },
			{
				status: 500,
				headers: {
					"Access-Control-Allow-Origin": allowedOrigin,
				},
			},
		);
	}
}
