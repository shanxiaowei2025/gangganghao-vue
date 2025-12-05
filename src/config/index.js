// 从 Vite 环境变量中读取后端接口地址（必须在 .env 文件中配置 VITE_API_BASE_URL）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 检查 API 地址是否配置
if (!API_BASE_URL) {
  console.error('错误: 未配置 VITE_API_BASE_URL 环境变量，请在 .env 文件中配置')
}

// 应用配置
export default {
  // 后端接口基础地址
  baseURL: API_BASE_URL,
  
  // 请求超时时间（毫秒）
  timeout: 10000,
  
  // Token 存储键名
  tokenKey: 'token',
  
  // 用户信息存储键名
  userInfoKey: 'userInfo'
}

