import { getAllRoleListPage } from "@/api/roles";
import {
	PlusOutlined,
	SearchOutlined,
	PlayCircleOutlined,
	PauseCircleOutlined,
	CheckCircleOutlined,
	LoadingOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Button,
	Card,
	Input,
	Space,
	Table,
	Tag,
	Form,
	message,
	Typography,
	Steps,
} from "antd";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export const Route = createFileRoute("/rag/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [taskId, setTaskId] = useState(null);
	const [inputTaskId, setInputTaskId] = useState(""); // 手动输入的任务ID
	const [queryLoading, setQueryLoading] = useState(false); // 查询按钮的加载状态
	const [taskStatus, setTaskStatus] = useState(null); // 任务状态
	const [polling, setPolling] = useState(false); // 轮询状态
	const pollingIntervalRef = useRef(null); // 轮询定时器引用
	const { TextArea } = Input;
	const { Title, Paragraph, Text } = Typography;

	// 清除轮询定时器
	const clearPollingInterval = () => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
			setPolling(false);
		}
	};

	// 组件卸载时清除轮询
	useEffect(() => {
		return () => clearPollingInterval();
	}, []);

	// 循环查询任务状态
	const checkTaskStatus = async (taskId) => {
		if (!taskId) return;

		setPolling(true);
		setTaskStatus("pending"); // 初始状态为等待中

		// 清除可能存在的旧定时器
		clearPollingInterval();

		// 开始轮询
		pollingIntervalRef.current = setInterval(async () => {
			try {
				const response = await axios.get(`/rag/tasks/${taskId}`, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				const { status, data } = response;

				if (status === 200) {
					setTaskStatus(data.status);

					// 根据任务状态处理
					if (data.status === "completed" || data.status === "success") {
						clearPollingInterval();
						message.success("任务已完成！");
					} else if (data.status === "failed" || data.status === "error") {
						clearPollingInterval();
						message.error(`任务执行失败: ${data.message || "未知错误"}`);
					}
					// 如果是 'pending' 或 'processing' 状态，继续轮询
				} else {
					message.error(`任务查询失败: ${data.message}`);
				}
			} catch (error) {
				console.error("查询任务状态错误:", error);
				message.error(`查询任务状态失败: ${error.message}`);
				clearPollingInterval();
			}
		}, 3000); // 每3秒检查一次
	};

	const onFinish = async (values) => {
		setLoading(true);
		try {
			// 直接使用对象作为请求数据，不使用formData
			const requestData = {
				domain: values.domain,
				example_queries: values.example_queries,
				entity_types: values.entity_types,
				readFile: values.readFile,
			};

			// 使用axios发送请求
			const response = await axios.post("/rag/analysis", requestData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			const { status, data } = response;
			if (status === 200) {
				const newTaskId = data.task_id;
				setTaskId(newTaskId);

				message.success(`ID是:${newTaskId}`);
			}
		} catch (error) {
			console.error("请求错误:", error);
			message.error(`请求失败: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	// 手动查询任务状态
	const handleQueryTask = async () => {
		if (!inputTaskId.trim()) {
			message.error("请输入有效的任务ID");
			return;
		}

		setQueryLoading(true);
		try {
			const response = await axios.get(`/rag/tasks/${inputTaskId}`, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			const { status, data } = response;
			if (status === 200) {
				setTaskId(inputTaskId); // 设置当前查询的任务ID
				setTaskStatus(data.status);
				message.success(`已获取任务状态: ${data.status}`);

				// 如果任务仍在进行中，开始轮询
				if (data.status === "pending" || data.status === "processing") {
					checkTaskStatus(inputTaskId);
				}
			} else {
				message.error(`任务查询失败: ${data.message || "未知错误"}`);
			}
		} catch (error) {
			console.error("查询任务错误:", error);
			message.error(`查询失败: ${error.message}`);
		} finally {
			setQueryLoading(false);
		}
	};

	// 获取任务状态对应的展示内容
	const getTaskStatusDisplay = () => {
		switch (taskStatus) {
			case "pending":
				return {
					icon: <LoadingOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
					text: "等待中",
					color: "#1890ff",
					step: 0,
				};
			case "processing":
				return {
					icon: (
						<PlayCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
					),
					text: "处理中",
					color: "#52c41a",
					step: 1,
				};
			case "paused":
				return {
					icon: (
						<PauseCircleOutlined style={{ fontSize: 24, color: "#faad14" }} />
					),
					text: "已暂停",
					color: "#faad14",
					step: 1,
				};
			case "completed":
			case "success":
				return {
					icon: (
						<CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
					),
					text: "已完成",
					color: "#52c41a",
					step: 2,
				};
			case "failed":
			case "error":
				return {
					icon: (
						<CloseCircleOutlined style={{ fontSize: 24, color: "#f5222d" }} />
					),
					text: "失败",
					color: "#f5222d",
					step: 2,
				};
			default:
				return {
					icon: <LoadingOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />,
					text: "未知",
					color: "#d9d9d9",
					step: 0,
				};
		}
	};

	const statusDisplay = taskStatus ? getTaskStatusDisplay() : null;

	return (
		<Card title="RAG 内容分析">
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					domain:
						"Parse all entities such as places, NPCs, personality traits, and character relationships to construct a virtual world and establish the connections between them.",
					example_queries:
						"咖啡厅在青樱町什么地方|千濑的二表姐是谁|镜之汤凌晨会开放什么",
					entity_types:
						"Character|Place|Age|Appearance|Personality|Traits|Background|Location|Exterior|Relationships|Special Settings",
					readFile:
						"https://seloselo2.oss-cn-hangzhou.aliyuncs.com/dev/graphrag/world.md",
				}}
			>
				<Form.Item
					label="分析域"
					name="domain"
					rules={[{ required: true, message: "请输入分析域" }]}
				>
					<TextArea rows={4} placeholder="请输入分析域描述" />
				</Form.Item>

				<Form.Item
					label="示例查询（用 | 分隔）"
					name="example_queries"
					rules={[{ required: true, message: "请输入示例查询" }]}
				>
					<TextArea rows={4} placeholder="示例：问题1|问题2|问题3" />
				</Form.Item>

				<Form.Item
					label="实体类型（用 | 分隔）"
					name="entity_types"
					rules={[{ required: true, message: "请输入实体类型" }]}
				>
					<Input placeholder="示例：人物|地点|事件" />
				</Form.Item>

				<Form.Item
					label="文件URL"
					name="readFile"
					rules={[{ required: true, message: "请输入文件URL" }]}
				>
					<Input placeholder="请输入文件URL" />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading}>
						提交分析任务
					</Button>
				</Form.Item>
			</Form>

			{/* 任务ID查询部分 */}
			<div style={{ marginTop: 24, marginBottom: 24 }}>
				<Card
					title="查询已有任务"
					size="small"
					style={{ background: "#fafafa" }}
				>
					<Space direction="horizontal">
						<Input
							placeholder="请输入任务ID"
							value={inputTaskId}
							onChange={(e) => setInputTaskId(e.target.value)}
							style={{ width: 300 }}
							allowClear
						/>
						<Button
							type="primary"
							icon={<SearchOutlined />}
							loading={queryLoading}
							onClick={handleQueryTask}
						>
							查询任务状态
						</Button>
					</Space>
					<Paragraph type="secondary" style={{ marginTop: 8, fontSize: 12 }}>
						如果您已有任务ID，可以在此输入查询任务执行状态
					</Paragraph>
				</Card>
			</div>

			{taskId && (
				<div
					style={{
						marginTop: 24,
						padding: 16,
						background: "#f0f2f5",
						borderRadius: 4,
					}}
				>
					<Title level={4}>分析任务</Title>
					<Paragraph>
						<Text strong>任务ID: </Text>
						<Text copyable>{taskId}</Text>
					</Paragraph>

					{/* 任务状态步骤条 */}
					<div style={{ margin: "20px 0" }}>
						<Steps
							current={statusDisplay ? statusDisplay.step : 0}
							items={[
								{
									title: "已提交",
									icon:
										polling && statusDisplay?.step === 0 ? (
											<LoadingOutlined />
										) : null,
								},
								{
									title: "处理中",
									icon:
										polling && statusDisplay?.step === 1 ? (
											<LoadingOutlined />
										) : null,
								},
								{
									title: "已完成",
								},
							]}
						/>
					</div>

					{/* 任务状态图标显示 */}
					{statusDisplay && (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginTop: 16,
								padding: "12px 16px",
								background: "#fff",
								borderRadius: 4,
								border: `1px solid ${statusDisplay.color}`,
							}}
						>
							{statusDisplay.icon}
							<Text
								strong
								style={{ marginLeft: 12, color: statusDisplay.color }}
							>
								任务状态: {statusDisplay.text}
							</Text>

							{polling && (
								<div style={{ marginLeft: "auto" }}>
									<LoadingOutlined style={{ marginRight: 8 }} />
									<Text type="secondary">正在查询最新状态...</Text>
								</div>
							)}
						</div>
					)}

					<Paragraph type="secondary" style={{ marginTop: 12 }}>
						{polling
							? "任务正在处理中，状态自动更新..."
							: "请保存任务ID以便后续查询任务状态"}
					</Paragraph>
				</div>
			)}
		</Card>
	);
}
