import podcastData from "@/config/podcast";
import { createFileRoute } from "@tanstack/react-router";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

export const Route = createFileRoute("/map")({
	component: MapPage,
});

function MapPage() {
	const mapContainerRef = useRef();
	const mapRef = useRef();

	useEffect(() => {
		// 播客数据

		mapboxgl.accessToken =
			"pk.eyJ1IjoicXFxcXFxMTIzIiwiYSI6ImNqNmQwNm54MTF4M3YzM3J5MzRlZ2puZmsifQ.5bQFa9EKudrIqYbWDrSi2w";

		mapRef.current = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			center: [0, 0],
			zoom: 2,
			projection: "globe",
		});

		mapRef.current.on("load", () => {
			// 设置雾效果和大气层
			mapRef.current.setFog({
				color: "rgb(10, 15, 25)",
				"high-color": "rgb(30, 35, 45)",
				"horizon-blend": 0.02,
				"space-color": "rgb(5, 10, 20)",
				"star-intensity": 0.6,
			});

			const width = 64;
			const bytesPerPixel = 4;
			const data = new Uint8Array(width * width * bytesPerPixel);

			for (let x = 0; x < width; x++) {
				for (let y = 0; y < width; y++) {
					const offset = (y * width + x) * bytesPerPixel;
					data[offset + 0] = (y / width) * 255;
					data[offset + 1] = (x / width) * 255;
					data[offset + 2] = 128;
					data[offset + 3] = 255;
				}
			}

			// 添加自动旋转功能
			let userInteracting = false;
			let interactionTimeout;
			const spinEnabled = true;

			function spinGlobe() {
				const zoom = mapRef.current.getZoom();
				if (spinEnabled && !userInteracting && zoom < 5) {
					const center = mapRef.current.getCenter();
					center.lng -= 0.5;
					mapRef.current.easeTo({ center, duration: 100 });
				}
				requestAnimationFrame(spinGlobe);
			}

			function setUserInteracting(isInteracting) {
				userInteracting = isInteracting;
				if (interactionTimeout) {
					clearTimeout(interactionTimeout);
				}
				if (!isInteracting) {
					// 交互结束后等待3秒再恢复自动旋转
					interactionTimeout = setTimeout(() => {
						userInteracting = false;
					}, 3000);
				}
			}

			// 开始旋转
			spinGlobe();

			// 用户交互时暂停旋转
			mapRef.current.on("mousedown", () => {
				setUserInteracting(true);
			});

			mapRef.current.on("dragstart", () => {
				setUserInteracting(true);
			});

			mapRef.current.on("drag", () => {
				setUserInteracting(true);
			});

			mapRef.current.on("dragend", () => {
				setUserInteracting(false);
			});

			mapRef.current.on("pitchstart", () => {
				setUserInteracting(true);
			});

			mapRef.current.on("pitchend", () => {
				setUserInteracting(false);
			});

			mapRef.current.on("rotatestart", () => {
				setUserInteracting(true);
			});

			mapRef.current.on("rotateend", () => {
				setUserInteracting(false);
			});

			mapRef.current.on("zoomstart", () => {
				setUserInteracting(true);
			});

			mapRef.current.on("zoomend", () => {
				setUserInteracting(false);
			});

			// 添加播客数据源
			mapRef.current.addSource("podcasts", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: podcastData.map((podcast) => ({
						type: "Feature",
						properties: {
							id: podcast.id,
							name: podcast.podcast_name,
							title: podcast.episode_title,
							date: podcast.episode_posted_at,
							podcast_image: podcast.podcast_image,
						},
						geometry: {
							type: "Point",
							coordinates: [podcast.longitude, podcast.latitude],
						},
					})),
				},
			});

			// 添加播客点图层
			mapRef.current.addLayer({
				id: "podcast-points",
				type: "circle",
				source: "podcasts",
				paint: {
					"circle-radius": {
						base: 1.75,
						stops: [
							[0, 4],
							[10, 8],
							[20, 12],
						],
					},
					"circle-color": "#00D4FF",
					"circle-stroke-color": "#FFFFFF",
					"circle-stroke-width": 1,
					"circle-opacity": 0.9,
					"circle-stroke-opacity": 0.8,
				},
			});

			// 添加脉冲效果图层
			mapRef.current.addLayer(
				{
					id: "podcast-pulse",
					type: "circle",
					source: "podcasts",
					paint: {
						"circle-radius": {
							base: 1.75,
							stops: [
								[0, 8],
								[10, 16],
								[20, 24],
							],
						},
						"circle-color": "#00D4FF",
						"circle-opacity": 0.3,
					},
				},
				"podcast-points",
			);

			// 添加播客标签图层
			mapRef.current.addLayer({
				id: "podcast-labels",
				type: "symbol",
				source: "podcasts",
				layout: {
					"text-field": ["get", "name"],
					"text-size": {
						base: 1,
						stops: [
							[0, 8],
							[10, 10],
							[20, 12],
						],
					},
					"text-offset": [0, 2],
					"text-anchor": "top",
					"text-max-width": 10,
					"text-optional": true,
				},
				paint: {
					"text-color": "#FFFFFF",
					"text-halo-color": "#000000",
					"text-halo-width": 2,
					"text-opacity": {
						base: 1,
						stops: [
							[0, 0],
							[5, 0.8],
							[10, 1],
						],
					},
				},
			});

			// 脉冲动画效果
			let pulseRadius = 0;
			function animatePulse() {
				pulseRadius += 0.5;
				if (pulseRadius > 20) {
					pulseRadius = 0;
				}

				mapRef.current.setPaintProperty("podcast-pulse", "circle-radius", {
					base: 1.75,
					stops: [
						[0, pulseRadius],
						[10, pulseRadius * 2],
						[20, pulseRadius * 3],
					],
				});

				// 确保透明度值在 0-1 范围内
				const opacity = Math.max(0, 0.6 - pulseRadius / 30);
				mapRef.current.setPaintProperty(
					"podcast-pulse",
					"circle-opacity",
					opacity,
				);

				requestAnimationFrame(animatePulse);
			}
			animatePulse();

			// 添加点击事件
			mapRef.current.on("click", "podcast-points", (e) => {
				const coordinates = e.features[0].geometry.coordinates.slice();
				const properties = e.features[0].properties;

				// 创建弹窗内容
				const popup = new mapboxgl.Popup({
					className: "dark-popup",
				})
					.setLngLat(coordinates)
					.setHTML(`
						<div style="
							padding: 15px; 
							max-width: 280px; 
							background: linear-gradient(135deg, #1a1a2e, #16213e);
							border: 1px solid #00D4FF;
							border-radius: 10px;
							color: white;
							font-family: Arial, sans-serif;
						">
							${properties.podcast_image ? `<img src="${properties.podcast_image}" alt="${properties.name}" style="width: 60px; height: 60px; border-radius: 8px; float: left; margin-right: 12px; border: 2px solid #00D4FF;">` : ""}
							<div style="overflow: hidden;">
								<h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #00D4FF;">${properties.name}</h3>
								<p style="margin: 0 0 5px 0; font-size: 11px; color: #B0B0B0;"><strong>Episode:</strong> ${properties.title}</p>
								<p style="margin: 0; font-size: 11px; color: #888;"><strong>Date:</strong> ${new Date(properties.date).toLocaleDateString()}</p>
							</div>
							<div style="clear: both;"></div>
						</div>
					`)
					.addTo(mapRef.current);
			});

			// 鼠标悬停效果
			mapRef.current.on("mouseenter", "podcast-points", () => {
				mapRef.current.getCanvas().style.cursor = "pointer";
				mapRef.current.setPaintProperty("podcast-points", "circle-radius", {
					base: 1.75,
					stops: [
						[0, 6],
						[10, 12],
						[20, 18],
					],
				});
			});

			mapRef.current.on("mouseleave", "podcast-points", () => {
				mapRef.current.getCanvas().style.cursor = "";
				mapRef.current.setPaintProperty("podcast-points", "circle-radius", {
					base: 1.75,
					stops: [
						[0, 4],
						[10, 8],
						[20, 12],
					],
				});
			});
		});

		// 清理函数
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
			}
		};
	}, []);

	return (
		<div
			id="map"
			ref={mapContainerRef}
			style={{ width: "100vw", height: "100vh" }}
		></div>
	);
}

export default MapPage;
