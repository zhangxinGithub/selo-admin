import React from "react";
import SideMenu from "./menu";
import useMenuStore from "@/store/menuStore";

const MainLayout = ({ children }) => {
	// 使用 Zustand store 获取菜单状态
	const { collapsed } = useMenuStore();

	return (
		<div className="flex h-screen bg-gray-100">
			{/* 侧边菜单 */}
			<SideMenu />

			{/* 占位 div，与菜单宽度相同，用于保持布局稳定 */}
			<div
				className={`shrink-0 transition-all duration-300 ${
					collapsed ? "w-[80px]" : "w-[200px]"
				}`}
			/>

			{/* 主内容区域 - 不再使用 margin-left，而是通过 flex 布局自动占据剩余空间 */}
			<div className="flex-1 flex flex-col transition-all duration-300">
				{/* 页头/导航栏 */}
				<header className="h-16 bg-white shadow-sm flex items-center px-6">
					<h1 className="text-xl font-semibold text-gray-800">Selo Admin</h1>
				</header>

				{/* 主要内容 */}
				<main className="flex-1 p-6 overflow-auto">{children}</main>
			</div>
		</div>
	);
};

export default MainLayout;
