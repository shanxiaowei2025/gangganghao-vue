// 从 Vite 环境变量中读取后端接口地址（需要在 .env 文件中配置 VITE_API_BASE_URL）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.7:8000'

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

