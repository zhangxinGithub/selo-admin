import MainLayout from "@/component/MainLayout";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

console.log("Root route loaded");
export const Route = createRootRoute({
	component: () => {
		// 获取当前路径
		const pathname = window.location.pathname;

		// 定义不需要菜单的路径列表
		const noMenuPaths = ["/login", "/404"];

		// 检查当前路径是否应该没有菜单
		const shouldHaveNoMenu = noMenuPaths.some(
			(path) => pathname === path || pathname.startsWith(`${path}/`),
		);

		// 根据路径选择布局
		return (
			<>
				{shouldHaveNoMenu ? (
					<EmptyLayout>
						<Outlet />
					</EmptyLayout>
				) : (
					<MainLayout>
						<Outlet />
					</MainLayout>
				)}
				<TanStackRouterDevtools />
			</>
		);
	},
});
