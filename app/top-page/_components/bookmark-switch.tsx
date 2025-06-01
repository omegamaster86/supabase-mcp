import React from 'react'

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

export default BookmarkSwitch;