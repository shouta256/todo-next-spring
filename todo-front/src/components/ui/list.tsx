import type React from "react";

type ListItemProps = {
	children: React.ReactNode;
	onClick?: () => void;
	selected?: boolean;
};

export function ListItem({ children, onClick, selected }: ListItemProps) {
	return (
		<li
			onClick={onClick}
			className={`cursor-pointer p-2 rounded-md ${selected ? "bg-gray-200" : "hover:bg-gray-100"}`}
		>
			{children}
		</li>
	);
}

type ListProps = {
	children: React.ReactNode;
};

export function List({ children }: ListProps) {
	return <ul className="space-y-1">{children}</ul>;
}
