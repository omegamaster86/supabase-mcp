import React from 'react'

const Dropdown = ({
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

export default Dropdown