import React, { useState, useEffect } from "react";
import SideMenu from "./menu";

const MainLayout = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);

	// Callback function for menu to communicate its collapsed state
	const handleMenuCollapse = (isCollapsed) => {
		setCollapsed(isCollapsed);
	};

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Side Menu with collapse callback */}
			<SideMenu onCollapse={handleMenuCollapse} />

			{/* Main Content Area - dynamic margin based on menu state */}
			<div
				className={`flex-1 flex flex-col ml-[${collapsed ? "80px" : "200px"}] transition-all duration-300`}
			>
				{/* Header/Navbar could be added here */}
				<header className="h-16 bg-white shadow-sm flex items-center px-6">
					<h1 className="text-xl font-semibold text-gray-800">Selo Admin</h1>
				</header>

				{/* Main Content */}
				<main className="flex-1 p-6 overflow-auto">{children}</main>
			</div>
		</div>
	);
};

export default MainLayout;
