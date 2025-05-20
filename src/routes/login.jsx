import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
	Form,
	Input,
	Button,
	Checkbox,
	Card,
	Typography,
	message,
	Space,
} from "antd";
import { createFileRoute } from "@tanstack/react-router";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import bgImg from "@/assets/demo.jpg";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

const { Title } = Typography;

function LoginPage() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const onFinish = async (values) => {
		try {
			setLoading(true);
			// Here you would typically make an API call to authenticate the user
			console.log("Login values:", values);

			// Simulate an API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// On successful login
			message.success("登录成功");
			navigate({ to: "/" });
		} catch (error) {
			message.error("登录失败，请检查用户名和密码");
			console.error("Login error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: `url(${bgImg})` }}
		>
			<Card className="w-[400px] shadow-lg bg-white/95" variant>
				<div className="text-center mb-6">
					<Title level={2}>系统登录</Title>
				</div>

				<Form
					name="login_form"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					size="large"
				>
					<Form.Item
						name="username"
						rules={[{ required: true, message: "请输入用户名" }]}
					>
						<Input
							prefix={<UserOutlined className="text-gray-400" />}
							placeholder="用户名"
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: "请输入密码" }]}
					>
						<Input.Password
							prefix={<LockOutlined className="text-gray-400" />}
							placeholder="密码"
						/>
					</Form.Item>

					<Form.Item>
						<div className="flex justify-between">
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>记住我</Checkbox>
							</Form.Item>

							{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
							<a className="text-blue-500 hover:text-blue-600" href="#">
								忘记密码
							</a>
						</div>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="w-full"
							loading={loading}
							icon={<LoginOutlined />}
						>
							登录
						</Button>
					</Form.Item>

					<div className="text-center">
						<Space>
							还没有账号？
							{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
							<a className="text-blue-500 hover:text-blue-600" href="#">
								立即注册
							</a>
						</Space>
					</div>
				</Form>
			</Card>
		</div>
	);
}

export default LoginPage;
