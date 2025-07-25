import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";

export const Route = createFileRoute("/products/code/list")({
	component: EventList,
});

function EventList() {
	const navigate = useNavigate();

	// 活动数据
	const [data, setData] = useState([
		{
			id: "1",
			name: "清明节活动",
			status: "active",
			startDate: "2024-06-10",
			endDate: "2024-06-10",
			description: "端午节促销活动",
		},
		{
			id: "2",
			name: "端午节活动",
			status: "active",
			startDate: "2024-06-10",
			endDate: "2024-06-10",
			description: "端午节促销活动",
		},
		{
			id: "3",
			name: "中秋节活动",
			status: "upcoming",
			startDate: "2024-09-17",
			endDate: "2024-09-17",
			description: "中秋节促销活动",
		},
		{
			id: "4",
			name: "2026春节活动",
			status: "planned",
			startDate: "2026-02-01",
			endDate: "2026-02-15",
			description: "2026年春节特别活动",
		},
		{
			id: "5",
			name: "国庆节活动",
			status: "planned",
			startDate: "2024-10-01",
			endDate: "2024-10-07",
			description: "国庆七天乐活动",
		},
	]);

	// 表格列定义
	const columns = [
		{
			title: "活动ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "活动名称",
			dataIndex: "name",
			key: "name",
			render: (text, record) => (
				<button
					type="button"
					onClick={() => handleEventClick(record.id)}
					style={{
						background: "none",
						border: "none",
						color: "#1890ff",
						cursor: "pointer",
						padding: 0,
					}}
				>
					{text}
				</button>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				let color = "green";
				let text = "进行中";

				if (status === "upcoming") {
					color = "geekblue";
					text = "即将开始";
				} else if (status === "planned") {
					color = "volcano";
					text = "规划中";
				}

				return <Tag color={color}>{text}</Tag>;
			},
		},
		{
			title: "开始日期",
			dataIndex: "startDate",
			key: "startDate",
		},
		{
			title: "结束日期",
			dataIndex: "endDate",
			key: "endDate",
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "操作",
			key: "action",
			render: (_, record) => (
				<Space size="middle">
					<button
						type="button"
						onClick={() => handleEventClick(record.id)}
						style={{
							background: "none",
							border: "none",
							color: "#1890ff",
							cursor: "pointer",
							padding: 0,
						}}
					>
						查看详情
					</button>
				</Space>
			),
		},
	];

	// 处理点击事件，跳转到详情页
	const handleEventClick = (id) => {
		// 使用 react-router 导航到详情页
		navigate({ to: "/products/code/code-detail" });
		console.log(`跳转到活动 ${id} 的详情页`);
	};

	return (
		<Card title="活动列表">
			<Typography.Paragraph>
				管理所有节假日营销活动，点击活动名称或"查看详情"按钮查看活动详情。
			</Typography.Paragraph>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		</Card>
	);
}
