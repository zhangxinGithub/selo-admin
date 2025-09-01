import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/map2d")({
	component: Map2dPage,
});

function Map2dPage() {
	//创建一个ref来存储地图实例
	const mapRef = useRef(null);
	const scrollRef = useRef(null);
	const [map, setMap] = useState(null);
	const [markers, setMarkers] = useState([]);
	const [mapMarkers, setMapMarkers] = useState([]);
	const [selectedMarkerId, setSelectedMarkerId] = useState(null);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);

	// 生成随机名称的函数
	const generateRandomName = (index) => {
		const names = [
			"New York Office",
			"London Branch",
			"Tokyo Data Center",
			"Sydney Operations",
			"Berlin Tech Hub",
			"San Francisco HQ",
			"Singapore Office",
			"Toronto Center",
			"Paris Division",
			"Mumbai Branch",
			"Dubai Office",
			"São Paulo Center",
			"Moscow Branch",
			"Seoul Operations",
			"Mexico City Office",
			"Stockholm Hub",
			"Cape Town Branch",
			"Bangkok Office",
			"Amsterdam Center",
			"Cairo Operations",
		];
		return names[index] || `Location ${index + 1}`;
	};

	// 处理位置项点击
	const handleMarkerClick = (markerId) => {
		setSelectedMarkerId(markerId);

		// 滚动到选中的卡片
		if (scrollRef.current) {
			const selectedCard = scrollRef.current.querySelector(
				`[data-marker-id="${markerId}"]`,
			);
			if (selectedCard) {
				selectedCard.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}
		}

		// 重置所有标记样式
		mapMarkers.forEach((mapMarker, index) => {
			if (mapMarker.setIcon) {
				mapMarker.setIcon(null); // 重置为默认图标
			}
		});

		// 高亮选中的标记
		const selectedMapMarker = mapMarkers[markerId - 1];
		if (selectedMapMarker) {
			// 设置高亮图标
			selectedMapMarker.setIcon({
				url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
					<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
						<circle cx="16" cy="16" r="12" fill="#ff4444" stroke="#fff" stroke-width="3"/>
						<circle cx="16" cy="16" r="6" fill="#fff"/>
					</svg>
				`)}`,
				scaledSize: new window.google.maps.Size(32, 32),
				anchor: new window.google.maps.Point(16, 16),
			});
		}
	};

	// 自动循环逻辑
	useEffect(() => {
		let interval;

		if (isAutoPlaying && markers.length > 0) {
			interval = setInterval(() => {
				setCurrentIndex((prevIndex) => {
					const nextIndex = (prevIndex + 1) % markers.length;
					const nextMarkerId = markers[nextIndex]?.id;
					if (nextMarkerId) {
						handleMarkerClick(nextMarkerId);
					}
					return nextIndex;
				});
			}, 2000); // 每2秒切换一次
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isAutoPlaying, markers, mapMarkers]);

	useEffect(() => {
		async function initMap() {
			// 检查 Google Maps API 是否已加载
			if (!window.google || !window.google.maps) {
				console.error("Google Maps API 尚未加载");
				return;
			}

			try {
				const { Map: GoogleMap } =
					await window.google.maps.importLibrary("maps");
				const { Marker } = await window.google.maps.importLibrary("marker");

				const mapInstance = new GoogleMap(mapRef.current, {
					center: { lat: 34.397, lng: -350.644 },
					zoom: 2,
				});

				// 添加20个随机标记
				const markersData = [];
				const createdMapMarkers = [];
				for (let i = 0; i < 20; i++) {
					// 生成随机经纬度
					const lat = (Math.random() - 0.5) * 180; // -90 到 90
					const lng = (Math.random() - 0.5) * 360; // -180 到 180

					const markerInfo = {
						id: i + 1,
						name: generateRandomName(i),
						lat: lat.toFixed(6),
						lng: lng.toFixed(6),
						status: Math.random() > 0.5 ? "在线" : "离线",
						lastUpdate: new Date().toLocaleString(),
					};

					const marker = new Marker({
						position: { lat, lng },
						map: mapInstance,
						title: markerInfo.name,
					});

					markersData.push(markerInfo);
					createdMapMarkers.push(marker);
				}

				setMarkers(markersData);
				setMapMarkers(createdMapMarkers);
				setMap(mapInstance);
			} catch (error) {
				console.error("初始化地图失败:", error);
			}
		}

		if (mapRef.current) {
			// 如果 Google Maps API 已加载，直接初始化
			if (window.google?.maps) {
				initMap();
			} else {
				// 否则等待 API 加载完成
				const checkGoogle = setInterval(() => {
					if (window.google?.maps) {
						clearInterval(checkGoogle);
						initMap();
					}
				}, 100);

				// 10秒后停止检查
				setTimeout(() => {
					clearInterval(checkGoogle);
				}, 10000);
			}
		}
	}, []);

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<div id="map" style={{ flex: 1, height: "100%" }} ref={mapRef}></div>

			{/* 右侧信息面板 */}
			<div
				ref={scrollRef}
				style={{
					width: "350px",
					backgroundColor: "#f5f5f5",
					padding: "20px",
					overflowY: "auto",
					borderLeft: "1px solid #ddd",
				}}
			>
				<h2 style={{ marginTop: 0, fontSize: "18px", color: "#333" }}>
					位置信息 ({markers.length})
				</h2>

				{markers.map((marker) => (
					<div
						key={marker.id}
						data-marker-id={marker.id}
						onClick={() => handleMarkerClick(marker.id)}
						style={{
							backgroundColor:
								selectedMarkerId === marker.id ? "#e3f2fd" : "white",
							padding: "12px",
							marginBottom: "10px",
							borderRadius: "6px",
							boxShadow:
								selectedMarkerId === marker.id
									? "0 4px 8px rgba(33, 150, 243, 0.3)"
									: "0 2px 4px rgba(0,0,0,0.1)",
							fontSize: "14px",
							cursor: "pointer",
							border:
								selectedMarkerId === marker.id
									? "2px solid #2196f3"
									: "2px solid transparent",
							transition: "all 0.2s ease",
						}}
					>
						<div
							style={{
								fontWeight: "bold",
								color: selectedMarkerId === marker.id ? "#1976d2" : "#2c3e50",
								marginBottom: "8px",
							}}
						>
							{marker.name}
						</div>
						<div style={{ color: "#666", lineHeight: "1.4" }}>
							<div>经度: {marker.lng}</div>
							<div>纬度: {marker.lat}</div>
							<div
								style={{
									color: marker.status === "在线" ? "#27ae60" : "#e74c3c",
									fontWeight: "500",
								}}
							>
								状态: {marker.status}
							</div>
							<div
								style={{ fontSize: "12px", color: "#95a5a6", marginTop: "4px" }}
							>
								更新: {marker.lastUpdate}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Map2dPage;
