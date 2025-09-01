import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import React, { use, useEffect } from "react";
import "./App.css";
// Create a new router instance
const router = createRouter({ routeTree });

// 创建实例
const queryClient = new QueryClient();

const App = () => {
	useEffect(() => {
		initMap();
	}, []);

	const initMap = async () => {
		((g) => {
			let h;
			let a;
			let k;
			const p = "The Google Maps JavaScript API";
			const c = "google";
			const l = "importLibrary";
			const q = "__ib__";
			const m = document;
			let b = window;
			if (!b[c]) {
				b[c] = {};
			}
			b = b[c];
			let d = b.maps;
			if (!d) {
				b.maps = {};
				d = b.maps;
			}
			const r = new Set();
			const e = new URLSearchParams();
			const u = () => {
				if (h) return h;

				h = new Promise((f, n) => {
					a = m.createElement("script");
					e.set("libraries", `${[...r]}`);
					for (k in g) {
						e.set(
							k.replace(/[A-Z]/g, (t) => `_${t[0].toLowerCase()}`),
							g[k],
						);
					}
					e.set("callback", `${c}.maps.${q}`);
					a.src = `https://maps.${c}apis.com/maps/api/js?${e}`;
					d[q] = f;
					a.onerror = () => {
						h = n(Error(`${p} could not load.`));
					};
					a.nonce = m.querySelector("script[nonce]")?.nonce || "";
					m.head.append(a);
				});
				return h;
			};

			if (d[l]) {
				console.warn(`${p} only loads once. Ignoring:`, g);
			} else {
				d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
			}
		})({ key: "AIzaSyAmBvFeUyHGc5KRLcpeTggQyZziRdzlHFc", v: "weekly" });
	};

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools />
			<RouterProvider
				//添加baseurl
				basepath="/yiche/"
				router={router}
			/>
		</QueryClientProvider>
	);
};
export default App;
