import useMenuStore from "@/store/menuStore";
import {
	AppstoreOutlined,
	FileOutlined,
	HomeOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	SettingOutlined,
	UserOutlined,
	DotChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button, Menu } from "antd";
import React, { useEffect } from "react";

// 菜单项配置
const menuItems = [
	{
		key: "index",
		icon: <HomeOutlined />,
		label: "首页",
		path: "/",
	},
	{
		key: "products",
		icon: <AppstoreOutlined />,
		label: "活动管理",
		path: "/products",
		children: [
			{
				key: "products-list",
				label: "兑换码发放",
				path: "/products/code/list",
			},
			{
				key: "products-categories",
				label: "产品分类",
				path: "/products/categories",
			},
		],
	},
	{
		key: "users",
		icon: <UserOutlined />,
		label: "用户管理",
		path: "/users",
	},
	{
		key: "roles",
		icon: <FileOutlined />,
		label: "角色列表",
		path: "/roles",
	},
	{
		key: "fast",
		icon: <DotChartOutlined />,
		label: "fast-graphRAG",
		path: "/rag",
	},
	{
		key: "query",
		icon: <SettingOutlined />,
		label: "请求插件",
		path: "/query",
	},
];

// 将菜单项配置转换为Ant Design的Menu组件所需格式
const getMenuItems = (items) => {
	return items.map((item) => {
		if (item.children) {
			return {
				key: item.key,
				icon: item.icon,
				label: item.label,
				children: getMenuItems(item.children),
			};
		}
		return {
			key: item.key,
			icon: item.icon,
			label: item.label,
		};
	});
};

const SideMenu = () => {
	const navigate = useNavigate();
	const router = useRouter();
	// 使用 Zustand store 替换本地状态
	const { collapsed, toggleCollapsed } = useMenuStore();

	// 根据当前路径获取初始选中的菜单项
	const getSelectedKey = () => {
		const path = router.state.location.pathname;

		// 特殊处理 /products/code/ 开头的路径，使其激活兑换码发放菜单
		if (path.startsWith("/products/code/")) {
			return "products-list";
		}

		const findKey = (items) => {
			for (const item of items) {
				// 检查完全匹配
				if (item.path === path) {
					return item.key;
				}
				// 对于父级菜单，检查是否为路径前缀
				if (item.path && path.startsWith(item.path) && item.path !== "/") {
					return item.key;
				}
				if (item.children) {
					const childKey = findKey(item.children);
					if (childKey) return childKey;
				}
			}
			return null;
		};

		return findKey(menuItems) || "index";
	};

	// 获取所有父级菜单keys
	const getParentKeys = () => {
		const selectedKey = getSelectedKey();
		const parentKeys = [];

		const findParentKeys = (items, parentKey = null) => {
			for (const item of items) {
				if (item.key === selectedKey) {
					if (parentKey) parentKeys.push(parentKey);
					return true;
				}
				if (item.children) {
					if (findParentKeys(item.children, item.key) && parentKey) {
						parentKeys.push(parentKey);
						return true;
					}
				}
			}
			return false;
		};

		findParentKeys(menuItems);
		return parentKeys;
	};

	const [selectedKey, setSelectedKey] = React.useState(getSelectedKey());
	const [openKeys, setOpenKeys] = React.useState(
		collapsed ? [] : getParentKeys(),
	);

	// 处理菜单展开/收起
	const handleOpenChange = (keys) => {
		setOpenKeys(keys);
	};

	// 当折叠状态改变时更新打开的菜单
	useEffect(() => {
		setOpenKeys(collapsed ? [] : getParentKeys());
	}, [collapsed]);

	// 监听路由变化，更新选中的菜单项和展开状态
	useEffect(() => {
		const currentKey = getSelectedKey();
		setSelectedKey(currentKey);

		// 如果菜单没有折叠，则更新展开的菜单项
		if (!collapsed) {
			setOpenKeys(getParentKeys());
		}
	}, [router.state.location.pathname, collapsed]);

	// 处理菜单项点击事件
	const handleMenuClick = ({ key }) => {
		setSelectedKey(key);

		// 根据key找到对应的路径进行导航
		const findPath = (items) => {
			for (const item of items) {
				if (item.key === key) {
					return item.path;
				}
				if (item.children) {
					const path = findPath(item.children);
					if (path) return path;
				}
			}
			return null;
		};

		const path = findPath(menuItems);
		if (path) {
			navigate({ to: path });
		}
	};

	return (
		<div
			className={`fixed left-0 top-0 h-screen ${collapsed ? "w-[80px]" : "w-[200px]"} bg-white transition-all duration-300 flex flex-col overflow-hidden shadow-md`}
		>
			<div className="flex justify-end p-2">
				<Button
					type="text"
					onClick={toggleCollapsed}
					className="flex items-center justify-center"
				>
					{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
				</Button>
			</div>
			<div className="flex-1 overflow-auto">
				<Menu
					mode="inline"
					selectedKeys={[selectedKey]}
					openKeys={openKeys}
					onOpenChange={handleOpenChange}
					onClick={handleMenuClick}
					items={getMenuItems(menuItems)}
					inlineCollapsed={collapsed}
					style={{ borderRight: 0 }}
				/>
			</div>
		</div>
	);
};

export default SideMenu;
