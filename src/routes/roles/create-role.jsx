import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	Form,
	Input,
	Button,
	Space,
	Radio,
	Select,
	Upload,
	message,
	Collapse,
} from "antd";
import { Link } from "@tanstack/react-router";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const { TextArea } = Input;
const { Panel } = Collapse;

export const Route = createFileRoute("/roles/create-role")({
	component: RouteComponent,
});

function RouteComponent() {
	const [form] = Form.useForm();
	const [imageUrl, setImageUrl] = useState("");

	const onFinish = (values) => {
		console.log("提交的表单数据:", values);
		// 这里可以添加创建角色的API调用
	};

	const beforeUpload = (file) => {
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		if (!isJpgOrPng) {
			message.error("只能上传JPG/PNG格式图片!");
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error("图片大小不能超过2MB!");
		}
		return isJpgOrPng && isLt2M;
	};

	const handleChange = (info) => {
		if (info.file.status === "done") {
			// 假设服务器返回图片URL
			setImageUrl(info.file.response.url);
		}
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>上传/制作形象</div>
		</div>
	);

	return (
		<Card title="创建新角色">
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Collapse defaultActiveKey={["1"]} bordered={false}>
					<Panel header="基本信息" key="1">
						<Form.Item name="avatar" label="角色形象">
							<Upload
								name="avatar"
								listType="picture-card"
								className="avatar-uploader"
								showUploadList={false}
								beforeUpload={beforeUpload}
								onChange={handleChange}
							>
								{imageUrl ? (
									<img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
								) : (
									uploadButton
								)}
							</Upload>
							<div style={{ color: "#999" }}>请勿使用真人照片</div>
						</Form.Item>

						<Form.Item
							name="name"
							label="名字"
							rules={[{ required: true, message: "请输入角色名称" }]}
						>
							<Input placeholder="请输入您的名字" maxLength={15} showCount />
						</Form.Item>

						<Form.Item name="age" label="年龄">
							<Input placeholder="请输入角色的年龄" maxLength={15} showCount />
						</Form.Item>

						<Form.Item name="occupation" label="职业">
							<Input placeholder="请输入角色的职业" maxLength={15} showCount />
						</Form.Item>

						<Form.Item name="catchPhrase" label="角色的一句台词">
							<Input placeholder="请输入台词" maxLength={80} showCount />
						</Form.Item>

						<Form.Item name="gender" label="性别">
							<Radio.Group>
								<Radio value="male">男性</Radio>
								<Radio value="female">女性</Radio>
								<Radio value="none">未设置</Radio>
							</Radio.Group>
						</Form.Item>

						<Form.Item name="basicInfo" label="基本信息">
							<TextArea
								placeholder="请填写背景、家庭、MBTI、身高等信息。"
								rows={4}
								maxLength={700}
								showCount
							/>
						</Form.Item>
					</Panel>

					<Panel header="角色详细设置" key="2">
						<Form.Item name="likes" label="喜欢">
							<TextArea
								placeholder="请输入角色喜欢的东西"
								rows={3}
								maxLength={50}
								showCount
							/>
						</Form.Item>

						<Form.Item name="dislikes" label="不喜欢">
							<TextArea
								placeholder="请输入角色不喜欢的东西"
								rows={3}
								maxLength={50}
								showCount
							/>
						</Form.Item>

						<Form.Item name="personality" label="性格">
							<TextArea
								placeholder="请填写角色性格"
								rows={4}
								maxLength={700}
								showCount
							/>
						</Form.Item>

						<Form.Item name="speakingStyle" label="说话风格与习惯">
							<TextArea
								placeholder="请输入示例"
								rows={4}
								maxLength={700}
								showCount
							/>
						</Form.Item>
					</Panel>

					<Panel header="第一次聊天场景" key="3">
						<Form.Item name="scenarioScript" label="情境脚本">
							<TextArea
								placeholder="请输入情境脚本"
								rows={4}
								maxLength={700}
								showCount
							/>
						</Form.Item>

						<Form.Item name="characterDialog" label="角色对话">
							<TextArea
								placeholder="请输入角色对话"
								rows={4}
								maxLength={700}
								showCount
							/>
						</Form.Item>
					</Panel>

					<Panel header="其他设置" key="4">
						<Form.Item name="story" label="故事">
							<TextArea
								placeholder="请输入大叙述"
								rows={4}
								maxLength={700}
								showCount
							/>
						</Form.Item>

						<Form.Item name="category" label="类别">
							<Select placeholder="请选择">
								<Select.Option value="friend">朋友</Select.Option>
								<Select.Option value="lover">恋人</Select.Option>
								<Select.Option value="family">家人</Select.Option>
								<Select.Option value="other">其他</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item name="tags" label="标签">
							<Select placeholder="请选择" mode="multiple">
								<Select.Option value="cute">可爱</Select.Option>
								<Select.Option value="mature">成熟</Select.Option>
								<Select.Option value="funny">搞笑</Select.Option>
								<Select.Option value="serious">严肃</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item name="introduction" label="简介">
							<TextArea
								placeholder="请输入简介"
								rows={4}
								maxLength={700}
								showCount
							/>
						</Form.Item>
					</Panel>
				</Collapse>

				<Form.Item style={{ marginTop: 16 }}>
					<Space>
						<Button type="primary" htmlType="submit">
							保存
						</Button>
						<Link to="/roles/">
							<Button>取消</Button>
						</Link>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	);
}
