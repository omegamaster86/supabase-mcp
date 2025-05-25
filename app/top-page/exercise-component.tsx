import React, { useState } from "react";

// ドロップダウン用の汎用コンポーネント
const SelectField = ({
	label,
	value,
	options,
	onChange,
	disabled,
	id,
}: {
	label: string;
	value: string;
	options: string[];
	onChange: (v: string) => void;
	disabled?: boolean;
	id: string;
}) => (
	<div className="mb-3 flex items-center">
		<label htmlFor={id} className="font-medium w-2/6">
			{label}
		</label>
		<select
			id={id}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
			className="w-4/6 border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
		>
			<option value="">選択してください</option>
			{options.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
	</div>
);

// ブックマークスイッチ
const BookmarkSwitch = ({
	checked,
	onChange,
	disabled,
}: {
	checked: boolean;
	onChange: (v: boolean) => void;
	disabled?: boolean;
}) => (
	<div className="mb-3">
		<label className="inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				disabled={disabled}
				className="form-checkbox h-5 w-5 text-blue-600 disabled:bg-gray-100"
			/>
			<span className="ml-2">ブックマークした問題のみを出題</span>
		</label>
	</div>
);

// 出題設定ラジオ
const FilterRadio = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) => (
	<div className="mb-3">
		<div className="font-medium mb-3">学習記録に基づく出題設定</div>
		<div className="flex flex-col gap-2">
			<label className="inline-flex items-center">
				<input
					type="radio"
					value="noFilter"
					checked={value === "noFilter"}
					onChange={() => onChange("noFilter")}
					className="form-radio text-blue-600"
				/>
				<span className="ml-2">絞り込みなし</span>
			</label>
			<label className="inline-flex items-center">
				<input
					type="radio"
					value="filterUnanswered"
					checked={value === "filterUnanswered"}
					onChange={() => onChange("filterUnanswered")}
					className="form-radio text-blue-600"
				/>
				<span className="ml-2">まだ解いていない</span>
			</label>
			<label className="inline-flex items-center">
				<input
					type="radio"
					value="filterLastIncorrect"
					checked={value === "filterLastIncorrect"}
					onChange={() => onChange("filterLastIncorrect")}
					className="form-radio text-blue-600"
				/>
				<span className="ml-2">直近で不正解</span>
			</label>
			<label className="inline-flex items-center">
				<input
					type="radio"
					value="filterUnconfidence"
					checked={value === "filterUnconfidence"}
					onChange={() => onChange("filterUnconfidence")}
					className="form-radio text-blue-600"
				/>
				<span className="ml-2">自信なし</span>
			</label>
		</div>
	</div>
);

// ダミーAPIエンドポイント
const API = {
	fetchInitial: async () => {
		// 本来はfetch('/api/initial')など
		return {
			tests: ["中小企業診断士", "宅建士"],
			mondaiFormatTypes: ["一問一答", "多肢択一"],
			subjects: ["民法", "刑法"],
			chapters: ["第1章", "第2章"],
			categories: ["A", "B"],
			importances: ["高", "中", "低"],
			mondaiCounts: ["10", "20", "30"],
			bookMarkActive: true,
		};
	},
	fetchOnSelect: async (params: Record<string, string | boolean>) => {
		// 本来はfetch('/api/on-select', { params })など
		return {
			mondaiFormatTypes: ["一問一答", "多肢択一"],
			subjects: ["民法", "刑法"],
			chapters: ["第1章", "第2章"],
			categories: ["A", "B"],
			importances: ["高", "中", "低"],
			mondaiCounts: ["10", "20", "30"],
			bookMarkActive: true,
		};
	},
};

const ExerciseComponent = () => {
	// 状態変数
	const [isLoading, setIsLoading] = useState(false);
	const [tests, setTests] = useState<string[]>([]);
	const [test, setTest] = useState("");
	const [mondaiFormatTypes, setMondaiFormatTypes] = useState<string[]>([]);
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

	// 初期表示API
	React.useEffect(() => {
		setIsLoading(true);
		API.fetchInitial().then((res) => {
			setTests(res.tests);
			setMondaiFormatTypes(res.mondaiFormatTypes);
			setSubjects(res.subjects);
			setChapters(res.chapters);
			setCategories(res.categories);
			setImportances(res.importances);
			setMondaiCounts(res.mondaiCounts);
			setBookMarkActive(res.bookMarkActive);
			setIsLoading(false);
		});
	}, []);

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
		const res = await API.fetchOnSelect({ test: v });
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
		const res = await API.fetchOnSelect({ test, mondaiFormatType: v });
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
		const res = await API.fetchOnSelect({ test, mondaiFormatType, subject: v });
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
		const res = await API.fetchOnSelect({
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
		const res = await API.fetchOnSelect({
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
		const res = await API.fetchOnSelect({
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
		const res = await API.fetchOnSelect({
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
			<SelectField
				label="試験種"
				id="test-type"
				value={test}
				options={tests}
				onChange={handleTestChange}
				disabled={false}
			/>
			<SelectField
				label="問題タイプ"
				id="mondai-type"
				value={mondaiFormatType}
				options={mondaiFormatTypes}
				onChange={handleMondaiFormatTypeChange}
				disabled={isFormatDisabled}
			/>
			<SelectField
				label="科目"
				id="subject"
				value={subject}
				options={subjects}
				onChange={handleSubjectChange}
				disabled={isSubjectDisabled}
			/>
			<SelectField
				label="章"
				id="chapter"
				value={chapter}
				options={chapters}
				onChange={handleChapterChange}
				disabled={isChapterDisabled}
			/>
			<SelectField
				label="カテゴリ"
				id="category"
				value={category}
				options={categories}
				onChange={handleCategoryChange}
				disabled={isCategoryDisabled}
			/>
			<SelectField
				label="重要度"
				id="importance"
				value={importance}
				options={importances}
				onChange={handleImportanceChange}
				disabled={isImportanceDisabled}
			/>
			<SelectField
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
				<FilterRadio value={filterType} onChange={setFilterType} />
			)}
			<div className="flex justify-center items-center">
				<button
					type="button"
					disabled={!canStart}
					className="mt-4 px-8 py-2 font-bold rounded-full bg-blue-600 text-white disabled:bg-gray-300"
				>
					テストを開始
				</button>
			</div>
		</div>
	);
};

export default ExerciseComponent;
