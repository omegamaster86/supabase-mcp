import React, { useState, useCallback } from "react";
import BookmarkSwitch from "./_components/bookmark-switch";
import Dropdown from "./_components/dropdown";
import FilterRadio from "./_components/filter-radio";

const ExerciseComponent = () => {
	// 状態変数
	const [isLoading, setIsLoading] = useState(false);
	const [tests, setTests] = useState<string[]>([
		"25中小企業診断士",
		"25社会保険労務士",
	]);
	const [test, setTest] = useState("");
	const [mondaiFormatTypes, setMondaiFormatTypes] = useState<string[]>([
		"一問一答",
		"多肢択一",
	]);
	const [mondaiFormatType, setMondaiFormatType] = useState("");
	const [subjects, setSubjects] = useState<string[]>([]);
	const [subject, setSubject] = useState("");
	const [chapters, setChapters] = useState<string[]>([]);
	const [chapter, setChapter] = useState("");
	const [categories, setCategories] = useState<string[]>([]);
	const [category, setCategory] = useState("");
	const [importances, setImportances] = useState<string[]>([]);
	const [importance, setImportance] = useState("");
	const [mondaiCounts, setMondaiCounts] = useState<string[]>([]);
	const [mondaiCount, setMondaiCount] = useState("");
	const [bookMarkActive, setBookMarkActive] = useState(true);
	const [bookmarkOnly, setBookmarkOnly] = useState(false);
	const [filterType, setFilterType] = useState("noFilter");

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
							testYearAndType: params.test || test || null,
							mondaiFormatType:
								params.mondaiFormatType || mondaiFormatType || null,
							subject: params.subject || subject || null,
							chapter: params.chapter || chapter || null,
							category: params.category || category || null,
							importanceType: params.importance || importance || null,
							calledFrom: "exercise-component",
							bookmark: params.bookmarkOnly || bookmarkOnly || false,
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
			test,
			mondaiFormatType,
			subject,
			chapter,
			category,
			importance,
			bookmarkOnly,
		],
	);

	// ドロップダウンの活性/非活性制御
	const isFormatDisabled = !test;
	const isSubjectDisabled = !mondaiFormatType;
	const isChapterDisabled = !subject;
	const isCategoryDisabled = !chapter;
	const isImportanceDisabled = false;
	const isCountDisabled = false;
	const isBookmarkDisabled = !bookMarkActive;

	// テスト開始ボタン活性条件
	const canStart = test && mondaiFormatType;

	// 各onChangeでリセット&API連携
	const handleTestChange = async (v: string) => {
		setTest(v);
		setMondaiFormatType("");
		setSubject("");
		setChapter("");
		setCategory("");
		setImportance("");
		setMondaiCount("");
		setBookmarkOnly(false);
		setIsLoading(true);
		const res = await fetchOnSelect({ test: v });
		setTests(res.tests);
		setMondaiFormatTypes(res.mondaiFormatTypes);
		setSubjects(res.subjects);
		setChapters(res.chapters);
		setCategories(res.categories);
		setImportances(res.importances);
		setMondaiCounts(res.mondaiCounts);
		setBookMarkActive(res.bookMarkActive);
		setIsLoading(false);
	};

	const handleMondaiFormatTypeChange = async (v: string) => {
		setMondaiFormatType(v);
		setSubject("");
		setChapter("");
		setCategory("");
		setImportance("");
		setMondaiCount("");
		setBookmarkOnly(false);
		setIsLoading(true);
		const res = await fetchOnSelect({ test, mondaiFormatType: v });
		setTests(res.tests);
		setMondaiFormatTypes(res.mondaiFormatTypes);
		setSubjects(res.subjects);
		setChapters(res.chapters);
		setCategories(res.categories);
		setImportances(res.importances);
		setMondaiCounts(res.mondaiCounts);
		setBookMarkActive(res.bookMarkActive);
		setIsLoading(false);
	};

	const handleSubjectChange = async (v: string) => {
		setSubject(v);
		setChapter("");
		setCategory("");
		setImportance("");
		setMondaiCount("");
		setBookmarkOnly(false);
		setIsLoading(true);
		const res = await fetchOnSelect({ test, mondaiFormatType, subject: v });
		setChapters(res.chapters);
		setCategories(res.categories);
		setImportances(res.importances);
		setMondaiCounts(res.mondaiCounts);
		setBookMarkActive(res.bookMarkActive);
		setIsLoading(false);
	};

	const handleChapterChange = async (v: string) => {
		setChapter(v);
		setCategory("");
		setImportance("");
		setMondaiCount("");
		setBookmarkOnly(false);
		setIsLoading(true);
		const res = await fetchOnSelect({
			test,
			mondaiFormatType,
			subject,
			chapter: v,
		});
		setCategories(res.categories);
		setImportances(res.importances);
		setMondaiCounts(res.mondaiCounts);
		setBookMarkActive(res.bookMarkActive);
		setIsLoading(false);
	};

	const handleCategoryChange = async (v: string) => {
		setCategory(v);
		setImportance("");
		setMondaiCount("");
		setBookmarkOnly(false);
		setIsLoading(true);
		const res = await fetchOnSelect({
			test,
			mondaiFormatType,
			subject,
			chapter,
			category: v,
		});
		setImportances(res.importances);
		setMondaiCounts(res.mondaiCounts);
		setBookMarkActive(res.bookMarkActive);
		setIsLoading(false);
	};

	const handleImportanceChange = async (v: string) => {
		setImportance(v);
		setMondaiCount("");
		setBookmarkOnly(false);
		setIsLoading(true);
		const res = await fetchOnSelect({
			test,
			mondaiFormatType,
			subject,
			chapter,
			category,
			importance: v,
		});
		setMondaiCounts(res.mondaiCounts);
		setBookMarkActive(res.bookMarkActive);
		setIsLoading(false);
	};

	const handleBookmarkChange = async (v: boolean) => {
		setBookmarkOnly(v);
		setMondaiCount("");
		setIsLoading(true);
		const res = await fetchOnSelect({
			test,
			mondaiFormatType,
			subject,
			chapter,
			category,
			importance,
			bookmarkOnly: v,
		});
		setMondaiCounts(res.mondaiCounts);
		setIsLoading(false);
	};

	return (
		<div className="p-14 rounded-lg shadow bg-blue-50">
			<div className="mb-4 font-bold">＊全て必須項目です</div>
			<div className="mb-4 font-bold">問題を絞り込む</div>
			{isLoading && <div className="mb-2 text-blue-500">読み込み中...</div>}
			<Dropdown
				label="試験種"
				id="test-type"
				value={test}
				options={tests}
				onChange={handleTestChange}
				disabled={false}
			/>
			<Dropdown
				label="問題タイプ"
				id="mondai-type"
				value={mondaiFormatType}
				options={mondaiFormatTypes}
				onChange={handleMondaiFormatTypeChange}
				disabled={isFormatDisabled}
			/>
			<Dropdown
				label="科目"
				id="subject"
				value={subject}
				options={subjects}
				onChange={handleSubjectChange}
				disabled={isSubjectDisabled}
			/>
			<Dropdown
				label="章"
				id="chapter"
				value={chapter}
				options={chapters}
				onChange={handleChapterChange}
				disabled={isChapterDisabled}
			/>
			<Dropdown
				label="カテゴリ"
				id="category"
				value={category}
				options={categories}
				onChange={handleCategoryChange}
				disabled={isCategoryDisabled}
			/>
			<Dropdown
				label="重要度"
				id="importance"
				value={importance}
				options={importances}
				onChange={handleImportanceChange}
				disabled={isImportanceDisabled}
			/>
			<Dropdown
				label="問題数"
				id="mondai-count"
				value={mondaiCount}
				options={mondaiCounts}
				onChange={setMondaiCount}
				disabled={isCountDisabled}
			/>
			<BookmarkSwitch
				checked={bookmarkOnly}
				onChange={handleBookmarkChange}
				disabled={isBookmarkDisabled}
			/>
			{mondaiFormatType === "多肢択一" && (
				<>
					<div className="font-medium mb-3">学習記録に基づく出題設定</div>
					<FilterRadio
						optionValue="noFilter"
						selectedValue={filterType}
						onChange={(v) => setFilterType(v)}
						label="絞り込みなし"
					/>
					<FilterRadio
						optionValue="filterUnanswered"
						selectedValue={filterType}
						onChange={(v) => setFilterType(v)}
						label="まだ解いていない"
					/>
					<FilterRadio
						optionValue="filterLastIncorrect"
						selectedValue={filterType}
						onChange={(v) => setFilterType(v)}
						label="直近で不正解"
					/>
					<FilterRadio
						optionValue="filterUnconfidence"
						selectedValue={filterType}
						onChange={(v) => setFilterType(v)}
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
