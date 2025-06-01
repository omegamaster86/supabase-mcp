import React, { useState, useCallback, useReducer } from "react";
import BookmarkSwitch from "./_components/bookmark-switch";
import Dropdown from "./_components/dropdown";
import FilterRadio from "./_components/filter-radio";

// 状態の型定義
interface State {
	isLoading: boolean;
	tests: string[];
	test: string;
	mondaiFormatTypes: string[];
	mondaiFormatType: string;
	subjects: string[];
	subject: string;
	chapters: string[];
	chapter: string;
	categories: string[];
	category: string;
	importances: string[];
	importance: string;
	mondaiCounts: string[];
	mondaiCount: string;
	bookMarkActive: boolean;
	bookmarkOnly: boolean;
	filterType: string;
}

// アクションの型定義
type Action =
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_TEST"; payload: string }
	| { type: "SET_MONDAI_FORMAT_TYPE"; payload: string }
	| { type: "SET_SUBJECT"; payload: string }
	| { type: "SET_CHAPTER"; payload: string }
	| { type: "SET_CATEGORY"; payload: string }
	| { type: "SET_IMPORTANCE"; payload: string }
	| { type: "SET_MONDAI_COUNT"; payload: string }
	| { type: "SET_BOOKMARK_ONLY"; payload: boolean }
	| { type: "SET_FILTER_TYPE"; payload: string }
	| {
			type: "SET_API_RESPONSE";
			payload: {
				tests?: string[];
				mondaiFormatTypes?: string[];
				subjects?: string[];
				chapters?: string[];
				categories?: string[];
				importances?: string[];
				mondaiCounts?: string[];
				bookMarkActive?: boolean;
			};
	  }
	| {
			type: "RESET_LOWER_FIELDS";
			level:
				| "test"
				| "mondaiFormatType"
				| "subject"
				| "chapter"
				| "category"
				| "importance";
	  };

// 初期状態
const initialState: State = {
	isLoading: false,
	tests: ["25中小企業診断士", "25社会保険労務士"],
	test: "",
	mondaiFormatTypes: ["一問一答", "多肢択一"],
	mondaiFormatType: "",
	subjects: [],
	subject: "",
	chapters: [],
	chapter: "",
	categories: [],
	category: "",
	importances: [],
	importance: "",
	mondaiCounts: [],
	mondaiCount: "",
	bookMarkActive: true,
	bookmarkOnly: false,
	filterType: "noFilter",
};

// リデューサー
const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, isLoading: action.payload };

		case "SET_TEST":
			return { ...state, test: action.payload };

		case "SET_MONDAI_FORMAT_TYPE":
			return { ...state, mondaiFormatType: action.payload };

		case "SET_SUBJECT":
			return { ...state, subject: action.payload };

		case "SET_CHAPTER":
			return { ...state, chapter: action.payload };

		case "SET_CATEGORY":
			return { ...state, category: action.payload };

		case "SET_IMPORTANCE":
			return { ...state, importance: action.payload };

		case "SET_MONDAI_COUNT":
			return { ...state, mondaiCount: action.payload };

		case "SET_BOOKMARK_ONLY":
			return { ...state, bookmarkOnly: action.payload };

		case "SET_FILTER_TYPE":
			return { ...state, filterType: action.payload };

		case "SET_API_RESPONSE":
			return {
				...state,
				tests: action.payload.tests || state.tests,
				mondaiFormatTypes:
					action.payload.mondaiFormatTypes || state.mondaiFormatTypes,
				subjects: action.payload.subjects || [],
				chapters: action.payload.chapters || [],
				categories: action.payload.categories || [],
				importances: action.payload.importances || [],
				mondaiCounts: action.payload.mondaiCounts || [],
				bookMarkActive: action.payload.bookMarkActive ?? state.bookMarkActive,
			};

		case "RESET_LOWER_FIELDS": {
			const resetFields: Partial<State> = {};
			if (action.level === "test") {
				resetFields.mondaiFormatType = "";
				resetFields.subject = "";
				resetFields.chapter = "";
				resetFields.category = "";
				resetFields.importance = "";
				resetFields.mondaiCount = "";
				resetFields.bookmarkOnly = false;
			} else if (action.level === "mondaiFormatType") {
				resetFields.subject = "";
				resetFields.chapter = "";
				resetFields.category = "";
				resetFields.importance = "";
				resetFields.mondaiCount = "";
				resetFields.bookmarkOnly = false;
			} else if (action.level === "subject") {
				resetFields.chapter = "";
				resetFields.category = "";
				resetFields.importance = "";
				resetFields.mondaiCount = "";
				resetFields.bookmarkOnly = false;
			} else if (action.level === "chapter") {
				resetFields.category = "";
				resetFields.importance = "";
				resetFields.mondaiCount = "";
				resetFields.bookmarkOnly = false;
			} else if (action.level === "category") {
				resetFields.importance = "";
				resetFields.mondaiCount = "";
				resetFields.bookmarkOnly = false;
			} else if (action.level === "importance") {
				resetFields.mondaiCount = "";
				resetFields.bookmarkOnly = false;
			}
			return { ...state, ...resetFields };
		}

		default:
			return state;
	}
};

const ExerciseComponent = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// API呼び出し関数
	const fetchOnSelect = useCallback(
		async (params: Record<string, string | boolean> = {}) => {
			try {
				const response = await fetch(
					"/api/end-user-fetch-importance-and-bookmark-and-count",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							supabaseAuthUserId: "2d9796fb-7d50-4c82-9a70-0d3046691731",
							testYearAndType: params.test || state.test || null,
							mondaiFormatType:
								params.mondaiFormatType || state.mondaiFormatType || null,
							subject: params.subject || state.subject || null,
							chapter: params.chapter || state.chapter || null,
							category: params.category || state.category || null,
							importanceType: params.importance || state.importance || null,
							calledFrom: "exercise-component",
							bookmark: params.bookmarkOnly || state.bookmarkOnly || false,
						}),
					},
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();

				if (result.error) {
					throw new Error(result.error);
				}

				const data = result.data;
				return {
					tests: data.tests || [],
					mondaiFormatTypes: data.mondai_format_types || [],
					subjects: data.subjects || [],
					chapters: data.chapters || [],
					categories: data.categories || [],
					importances: data.importances || [],
					mondaiCounts: data.mondai_counts || [],
					bookMarkActive: data.bookmark_active !== false,
				};
			} catch (error) {
				console.error("fetchOnSelect error:", error);
				return {
					tests: [],
					mondaiFormatTypes: [],
					subjects: [],
					chapters: [],
					categories: [],
					importances: [],
					mondaiCounts: [],
					bookMarkActive: false,
				};
			}
		},
		[
			state.test,
			state.mondaiFormatType,
			state.subject,
			state.chapter,
			state.category,
			state.importance,
			state.bookmarkOnly,
		],
	);

	// ドロップダウンの活性/非活性制御
	const isFormatDisabled = !state.test;
	const isSubjectDisabled = !state.mondaiFormatType;
	const isChapterDisabled = !state.subject;
	const isCategoryDisabled = !state.chapter;
	const isImportanceDisabled = false;
	const isCountDisabled = false;
	const isBookmarkDisabled = !state.bookMarkActive;

	// テスト開始ボタン活性条件
	const canStart = state.test && state.mondaiFormatType;

	// 各onChangeでリセット&API連携
	const handleTestChange = async (v: string) => {
		dispatch({ type: "SET_TEST", payload: v });
		dispatch({ type: "RESET_LOWER_FIELDS", level: "test" });
		dispatch({ type: "SET_LOADING", payload: true });
		const res = await fetchOnSelect({ test: v });
		dispatch({ type: "SET_API_RESPONSE", payload: res });
		dispatch({ type: "SET_LOADING", payload: false });
	};

	const handleMondaiFormatTypeChange = async (v: string) => {
		dispatch({ type: "SET_MONDAI_FORMAT_TYPE", payload: v });
		dispatch({ type: "RESET_LOWER_FIELDS", level: "mondaiFormatType" });
		dispatch({ type: "SET_LOADING", payload: true });
		const res = await fetchOnSelect({ test: state.test, mondaiFormatType: v });
		dispatch({ type: "SET_API_RESPONSE", payload: res });
		dispatch({ type: "SET_LOADING", payload: false });
	};

	const handleSubjectChange = async (v: string) => {
		dispatch({ type: "SET_SUBJECT", payload: v });
		dispatch({ type: "RESET_LOWER_FIELDS", level: "subject" });
		dispatch({ type: "SET_LOADING", payload: true });
		const res = await fetchOnSelect({
			test: state.test,
			mondaiFormatType: state.mondaiFormatType,
			subject: v,
		});
		dispatch({ type: "SET_API_RESPONSE", payload: res });
		dispatch({ type: "SET_LOADING", payload: false });
	};

	const handleChapterChange = async (v: string) => {
		dispatch({ type: "SET_CHAPTER", payload: v });
		dispatch({ type: "RESET_LOWER_FIELDS", level: "chapter" });
		dispatch({ type: "SET_LOADING", payload: true });
		const res = await fetchOnSelect({
			test: state.test,
			mondaiFormatType: state.mondaiFormatType,
			subject: state.subject,
			chapter: v,
		});
		dispatch({ type: "SET_API_RESPONSE", payload: res });
		dispatch({ type: "SET_LOADING", payload: false });
	};

	const handleCategoryChange = async (v: string) => {
		dispatch({ type: "SET_CATEGORY", payload: v });
		dispatch({ type: "RESET_LOWER_FIELDS", level: "category" });
		dispatch({ type: "SET_LOADING", payload: true });
		const res = await fetchOnSelect({
			test: state.test,
			mondaiFormatType: state.mondaiFormatType,
			subject: state.subject,
			chapter: state.chapter,
			category: v,
		});
		dispatch({ type: "SET_API_RESPONSE", payload: res });
		dispatch({ type: "SET_LOADING", payload: false });
	};

	const handleImportanceChange = async (v: string) => {
		dispatch({ type: "SET_IMPORTANCE", payload: v });
		dispatch({ type: "RESET_LOWER_FIELDS", level: "importance" });
		dispatch({ type: "SET_LOADING", payload: true });
		const res = await fetchOnSelect({
			test: state.test,
			mondaiFormatType: state.mondaiFormatType,
			subject: state.subject,
			chapter: state.chapter,
			category: state.category,
			importance: v,
		});
		dispatch({ type: "SET_API_RESPONSE", payload: res });
		dispatch({ type: "SET_LOADING", payload: false });
	};

	const handleBookmarkChange = async (v: boolean) => {
		dispatch({ type: "SET_BOOKMARK_ONLY", payload: v });
		dispatch({ type: "SET_MONDAI_COUNT", payload: "" });
		dispatch({ type: "SET_LOADING", payload: true });
		const res = await fetchOnSelect({
			test: state.test,
			mondaiFormatType: state.mondaiFormatType,
			subject: state.subject,
			chapter: state.chapter,
			category: state.category,
			importance: state.importance,
			bookmarkOnly: v,
		});
		dispatch({ type: "SET_API_RESPONSE", payload: res });
		dispatch({ type: "SET_LOADING", payload: false });
	};

	return (
		<div className="p-14 rounded-lg shadow bg-blue-50">
			<div className="mb-4 font-bold">＊全て必須項目です</div>
			<div className="mb-4 font-bold">問題を絞り込む</div>
			{state.isLoading && (
				<div className="mb-2 text-blue-500">読み込み中...</div>
			)}
			<Dropdown
				label="試験種"
				id="test-type"
				value={state.test}
				options={state.tests}
				onChange={handleTestChange}
				disabled={false}
			/>
			<Dropdown
				label="問題タイプ"
				id="mondai-type"
				value={state.mondaiFormatType}
				options={state.mondaiFormatTypes}
				onChange={handleMondaiFormatTypeChange}
				disabled={isFormatDisabled}
			/>
			<Dropdown
				label="科目"
				id="subject"
				value={state.subject}
				options={state.subjects}
				onChange={handleSubjectChange}
				disabled={isSubjectDisabled}
			/>
			<Dropdown
				label="章"
				id="chapter"
				value={state.chapter}
				options={state.chapters}
				onChange={handleChapterChange}
				disabled={isChapterDisabled}
			/>
			<Dropdown
				label="カテゴリ"
				id="category"
				value={state.category}
				options={state.categories}
				onChange={handleCategoryChange}
				disabled={isCategoryDisabled}
			/>
			<Dropdown
				label="重要度"
				id="importance"
				value={state.importance}
				options={state.importances}
				onChange={handleImportanceChange}
				disabled={isImportanceDisabled}
			/>
			<Dropdown
				label="問題数"
				id="mondai-count"
				value={state.mondaiCount}
				options={state.mondaiCounts}
				onChange={(v) => dispatch({ type: "SET_MONDAI_COUNT", payload: v })}
				disabled={isCountDisabled}
			/>
			<BookmarkSwitch
				checked={state.bookmarkOnly}
				onChange={handleBookmarkChange}
				disabled={isBookmarkDisabled}
			/>
			{state.mondaiFormatType === "多肢択一" && (
				<>
					<div className="font-medium mb-3">学習記録に基づく出題設定</div>
					<FilterRadio
						optionValue="noFilter"
						selectedValue={state.filterType}
						onChange={(v) => dispatch({ type: "SET_FILTER_TYPE", payload: v })}
						label="絞り込みなし"
					/>
					<FilterRadio
						optionValue="filterUnanswered"
						selectedValue={state.filterType}
						onChange={(v) => dispatch({ type: "SET_FILTER_TYPE", payload: v })}
						label="まだ解いていない"
					/>
					<FilterRadio
						optionValue="filterLastIncorrect"
						selectedValue={state.filterType}
						onChange={(v) => dispatch({ type: "SET_FILTER_TYPE", payload: v })}
						label="直近で不正解"
					/>
					<FilterRadio
						optionValue="filterUnconfidence"
						selectedValue={state.filterType}
						onChange={(v) => dispatch({ type: "SET_FILTER_TYPE", payload: v })}
						label="自信なし"
					/>
				</>
			)}
			<div className="flex justify-center items-center">
				<button
					type="button"
					disabled={!canStart}
					className="px-8 py-2 font-bold rounded-full bg-blue-600 text-white disabled:bg-gray-300"
				>
					テストを開始
				</button>
			</div>
		</div>
	);
};

export default ExerciseComponent;
