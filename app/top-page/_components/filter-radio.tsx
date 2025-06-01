import type React from 'react'

interface FilterRadioProps {
  optionValue: string;
  selectedValue: string;
  onChange: (v: string) => void;
  label: string;
}

const FilterRadio: React.FC<FilterRadioProps> = ({
  optionValue,
  selectedValue,
  onChange,
  label,
}) => (
	<div className="mb-3">
		<div className="flex flex-col gap-2">
			<label className="inline-flex items-center">
				<input
					type="radio"
					value={optionValue}
					checked={selectedValue === optionValue}
					onChange={() => onChange(optionValue)}
					className="form-radio text-blue-600"
				/>
				<span className="ml-2">{label}</span>
			</label>
		</div>
	</div>
);

export default FilterRadio;