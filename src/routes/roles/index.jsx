import { getAllRoleListPage } from "@/api/roles";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button, Card, Input, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/roles/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isPending, error, data, isFetching } = useQuery({
		queryKey: ["roles", "list"],
		queryFn: () =>
			getAllRoleListPage({
				pagination: {
					current: pagination.current,
					pageSize: pagination.pageSize,
				},
				searchText: searchText,
			}),
		initialData: {
			list: [],
		},
	});

	console.log("数据", data);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});
	const [searchText, setSearchText] = useState("");

	// 处理表格变化
	const handleTableChange = (newPagination) => {
		setPagination({
			...pagination,
			current: newPagination.current,
			pageSize: newPagination.pageSize,
		});
	};

	// 表格列定义
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 80,
		},
		{
			title: "角色名称",
			dataIndex: "roleName",
			key: "roleName",
			render: (text, record) => (
				<Link to={`/roles/role-info?id=${record.id}`}>{text}</Link>
			),
		},
		{
			title: "serialNumber",
			dataIndex: "serialNumber",
			key: "serialNumber",
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text) => new Date(text).toLocaleString("zh-CN"),
		},
		{
			title: "操作",
			key: "action",
			fixed: "right",
			width: 160,
			render: (_, record) => (
				<Space size="middle">
					<Link to={`/roles/role-info?id=${record.id}`}>编辑</Link>
					<Button
						type="link"
						onClick={() => {
							/* Add delete handler here */
						}}
					>
						删除
					</Button>
				</Space>
			),
		},
	];

	return (
		<Card
			title="角色管理"
			extra={
				<Space>
					<Input
						placeholder="搜索角色名称"
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 200 }}
						allowClear
					/>
					<Link to="/roles/role-info?create=true">
						<Button type="primary" icon={<PlusOutlined />}>
							新增角色
						</Button>
					</Link>
				</Space>
			}
		>
			<Table
				columns={columns}
				dataSource={data.list}
				rowKey="id"
				pagination={pagination}
				loading={isPending}
				onChange={handleTableChange}
				scroll={{ x: 1000 }}
			/>
		</Card>
	);
}
