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

	const {
		supabaseAuthUserId,
		testYearAndType,
		mondaiFormatType,
		subject,
		chapter,
		category,
		importanceType,
		calledFrom,
		bookmark,
	} = await req.json();

	try {
		const { data, error } = await supabase.rpc(
			"end_user_fetch_importance_and_bookmark_and_count",
			{
				param_supabase_auth_user_id: supabaseAuthUserId,
				param_test: testYearAndType,
				param_mondai_format_type: mondaiFormatType,
				param_subject: subject,
				param_chapter: chapter,
				param_category: category,
				param_importance: importanceType,
				param_from: calledFrom,
				param_bookmark: bookmark,
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
