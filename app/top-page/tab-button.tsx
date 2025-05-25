import type React from "react";

type TabButtonProps = {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => {
	return (
		<button
			type="button"
			className={`flex-1 p-2 cursor-pointer ${active ? "bg-blue-50" : "bg-white"}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default TabButton;
