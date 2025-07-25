import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "antd";
import React from "react";

export const Route = createFileRoute("/query")({
	component: App,
});

// 创建实例
const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools />
			<Example />
		</QueryClientProvider>
	);
}

function Example() {
	// 发请求
	const { isPending, error, data, isFetching } = useQuery({
		queryKey: ["repoData"],
		queryFn: async () => {
			const response = await fetch(
				"https://api.github.com/repos/TanStack/query",
			);
			return await response.json();
		},
	});
	console.log("数据", data);
	// 处理请求正在加载中的状态
	if (isPending)
		return (
			<div>
				<Skeleton active title={{ width: "50%" }} paragraph={{ rows: 3 }} />
			</div>
		);

	// 处理请求出错的状态
	if (error) return `An error has occurred: ${error.message}`;

	return (
		<div>
			<h1>{data.full_name}</h1>
			<p>{data.description}</p>
			<strong>👀 {data.subscribers_count}</strong>{" "}
			<strong>✨ {data.stargazers_count}</strong>{" "}
			<strong>🍴 {data.forks_count}</strong>
			<div>{isFetching ? "Updating..." : ""}</div>
		</div>
	);
}
