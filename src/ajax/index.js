import axios from 'axios';

// 创建一个带有自定义配置的axios实例
const ajax = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://api.example.com', // 替换为您的生产环境API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
ajax.interceptors.request.use(
  config => {
    // 从localStorage或认证状态中获取token
    const token = localStorage.getItem('token');

    // 如果token存在，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
ajax.interceptors.response.use(
  response => {
    // 如有需要，可以在这里转换数据
    return response.data;
  },
  error => {
    // 处理常见错误
    const { response } = error;

    if (response) {
      // 请求已发出，服务器用非2xx状态码响应
      switch (response.status) {
        case 401:
          // 处理未授权
          // 您可能想重定向到登录页面
          console.error('未授权访问');
          break;
        case 404:
          console.error('未找到资源');
          break;
        default:
          console.error('服务器错误:', response.data.message || '未知错误');
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，未收到响应');
    } else {
      // 设置请求时发生了错误
      console.error('错误:', error.message);
    }

    return Promise.reject(error);
  }
);

// 常用HTTP方法的辅助函数
const http = {
  get: (url, params, config = {}) => ajax.get(url, { params, ...config }),
  post: (url, data, config = {}) => ajax.post(url, data, config),
  put: (url, data, config = {}) => ajax.put(url, data, config),
  delete: (url, config = {}) => ajax.delete(url, config),
  patch: (url, data, config = {}) => ajax.patch(url, data, config)
};

export default http;