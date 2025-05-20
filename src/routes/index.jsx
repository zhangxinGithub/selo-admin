import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div>
			<h1 className="text-3xl font-bold mb-4">欢迎使用Selo Admin系统</h1>
			<p>请从左侧菜单选择功能模块</p>
		</div>
	);
}
