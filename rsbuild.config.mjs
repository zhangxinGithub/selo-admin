import path from "node:path";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

export default defineConfig({
	output: {
		// 设置静态资源的基础路径
		assetPrefix: "/yiche/",
	},
	//设置端口为5555
	server: {
		port: 5555,
		proxy: {
			"/rag/": {
				// 修改为更简单的前缀匹配
				target: "http://121.43.121.65:8099",
				changeOrigin: true,
			},
			"/rest/": {
				// 修改为更简单的前缀匹配
				target: "https://cmgcxfnucjpiyqouvsmg.supabase.co",
				changeOrigin: true,
			},
		},
	},
	plugins: [pluginReact()],
	tools: {
		rspack: {
			plugins: [
				TanStackRouterRspack({ target: "react", autoCodeSplitting: true }),
				new (await import("@rspack/core")).DefinePlugin({
					"global.google": "window.google",
					google: "window.google",
				}),
			],
			resolve: {
				fallback: {
					global: false,
				},
			},
			module: {
				unknownContextCritical: false,
			},
		},
	},
	source: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
