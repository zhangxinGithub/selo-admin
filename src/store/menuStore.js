import { create } from "zustand";

// 从sessionStorage获取折叠状态或使用默认值
const getCollapsedFromSession = () => {
	try {
		const storedValue = sessionStorage.getItem("menuCollapsed");
		return storedValue !== null ? JSON.parse(storedValue) : false;
	} catch (error) {
		console.error("Failed to get collapsed state from sessionStorage:", error);
		return false;
	}
};

// 保存折叠状态到sessionStorage
const saveCollapsedToSession = (collapsed) => {
	try {
		sessionStorage.setItem("menuCollapsed", JSON.stringify(collapsed));
	} catch (error) {
		console.error("Failed to save collapsed state to sessionStorage:", error);
	}
};

// 创建菜单状态存储
const useMenuStore = create((set) => ({
	// 从sessionStorage获取初始状态
	collapsed: getCollapsedFromSession(),
	// 切换菜单状态并保存到sessionStorage
	toggleCollapsed: () =>
		set((state) => {
			const newCollapsed = !state.collapsed;
			saveCollapsedToSession(newCollapsed);
			return { collapsed: newCollapsed };
		}),
	// 直接设置菜单状态并保存到sessionStorage
	setCollapsed: (collapsed) => {
		saveCollapsedToSession(collapsed);
		set({ collapsed });
	},
}));

export default useMenuStore;
