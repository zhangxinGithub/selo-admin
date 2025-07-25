import axios from "axios";

// 创建一个带有自定义配置的axios实例
const http = axios.create({
	baseURL:
		process.env.NODE_ENV === "development"
			? "https://minapp.seloselo.cn/api"
			: "https://api.example.com", // 替换为您的生产环境API URL
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Authorization: "123",
	},
});
const ajax = async (url, method = "GET", data = null) => {
	try {
		const response = await http({
			url,
			method,
			...(method === "GET" ? { params: data } : { data }),
		});
		if (response.status !== 200) {
			throw new Error(`API请求失败: ${response.status}`);
		}

		return response.data.data;
	} catch (error) {
		console.error("API请求错误:", error);
		throw error;
	}
};
export default ajax;
