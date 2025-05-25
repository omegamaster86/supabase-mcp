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
	<div className="mb-3">
		<label htmlFor={id} className="mr-2 font-medium">
			{label}
		</label>
		<select
			id={id}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
			className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
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
		<div className="font-medium mb-1">出題設定</div>
		<div className="flex flex-col gap-1">
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

const ExerciseComponent = () => {
	// 状態変数（ダミー初期値）
	const [isLoading, setIsLoading] = useState(false);
	const [bookMarkActive, setBookMarkActive] = useState(true);
	const [tests, setTests] = useState("");
	const [mondaiFormatType, setMondaiFormatType] = useState("");
	const [subject, setSubject] = useState("");
	const [chapter, setChapter] = useState("");
	const [category, setCategory] = useState("");
	const [importance, setImportance] = useState("");
	const [mondaiCount, setMondaiCount] = useState("");
	const [bookmarkOnly, setBookmarkOnly] = useState(false);
	const [filterType, setFilterType] = useState("noFilter");

	// ドロップダウンの活性/非活性制御
	const isFormatDisabled = !tests;
	const isSubjectDisabled = !mondaiFormatType;
	const isChapterDisabled = !subject;
	const isCategoryDisabled = !chapter;
	const isImportanceDisabled = false;
	const isCountDisabled = false;
	const isBookmarkDisabled = !bookMarkActive;

	// テスト開始ボタン活性条件
	const canStart = tests && mondaiFormatType;

	return (
		<div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
			<div className="mb-4 font-bold">＊全て必須項目です</div>
			<div className="mb-4 font-bold">問題を絞り込む</div>
			<SelectField
				label="試験種"
				id="test-type"
				value={tests}
				options={["中小企業診断士", "宅建士"]}
				onChange={setTests}
				disabled={false}
			/>
			<SelectField
				label="問題タイプ"
				id="mondai-type"
				value={mondaiFormatType}
				options={["一問一答", "多肢択一"]}
				onChange={setMondaiFormatType}
				disabled={isFormatDisabled}
			/>
			<SelectField
				label="科目"
				id="subject"
				value={subject}
				options={["民法", "刑法"]}
				onChange={setSubject}
				disabled={isSubjectDisabled}
			/>
			<SelectField
				label="章"
				id="chapter"
				value={chapter}
				options={["第1章", "第2章"]}
				onChange={setChapter}
				disabled={isChapterDisabled}
			/>
			<SelectField
				label="カテゴリ"
				id="category"
				value={category}
				options={["A", "B"]}
				onChange={setCategory}
				disabled={isCategoryDisabled}
			/>
			<SelectField
				label="重要度"
				id="importance"
				value={importance}
				options={["高", "中", "低"]}
				onChange={setImportance}
				disabled={isImportanceDisabled}
			/>
			<SelectField
				label="問題数"
				id="mondai-count"
				value={mondaiCount}
				options={["10", "20", "30"]}
				onChange={setMondaiCount}
				disabled={isCountDisabled}
			/>
			<BookmarkSwitch
				checked={bookmarkOnly}
				onChange={setBookmarkOnly}
				disabled={isBookmarkDisabled}
			/>
			{mondaiFormatType === "多肢択一" && (
				<FilterRadio value={filterType} onChange={setFilterType} />
			)}
			<button
				type="button"
				disabled={!canStart}
				className="mt-4 px-8 py-2 font-bold rounded bg-blue-600 text-white disabled:bg-gray-300"
			>
				テストを開始
			</button>
		</div>
	);
};

export default ExerciseComponent;
