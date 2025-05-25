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
			style={{
				flex: 1,
				padding: "1rem",
				background: active ? "#e0e0e0" : "white",
				border: "none",
				borderBottom: active ? "2px solid #1976d2" : "none",
				cursor: "pointer",
			}}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default TabButton;
