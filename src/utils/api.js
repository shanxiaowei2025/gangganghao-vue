import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import config from '@/config'

// 创建 axios 实例
const service = axios.create({
  baseURL: config.baseURL, // 后端接口基础地址
  timeout: config.timeout // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  requestConfig => {
    // 从 localStorage 获取 token（使用全局配置中的 key）
    const token = localStorage.getItem(config.tokenKey)
    if (token) {
      // 确保 headers 存在
      requestConfig.headers = requestConfig.headers || {}
      // 将 token 添加到请求头
      requestConfig.headers.Authorization = `Bearer ${token}`
    }
    return requestConfig
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果返回的数据中包含 code 字段，则按统一格式处理
    if (res && typeof res === 'object' && 'code' in res) {
      const isLoginRequest =
        response.config?.url?.includes('/api/auth/login') ||
        response.config?.url?.includes('/api/login')
      const isUserListRequest =
        response.config?.url?.includes('/api/users') &&
        String(response.config?.method).toLowerCase() === 'get' &&
        response.config?.params &&
        Object.prototype.hasOwnProperty.call(response.config.params, 'page')

      const isRoleListRequest =
        response.config?.url?.includes('/api/roles') &&
        String(response.config?.method).toLowerCase() === 'get' &&
        response.config?.params &&
        Object.prototype.hasOwnProperty.call(response.config.params, 'page')

      const isDepartmentListRequest =
        response.config?.url?.includes('/api/departments') &&
        String(response.config?.method).toLowerCase() === 'get' &&
        response.config?.params &&
        Object.prototype.hasOwnProperty.call(response.config.params, 'page')

      const isPageListRequest =
        response.config?.url?.includes('/api/permissions/pages') &&
        String(response.config?.method).toLowerCase() === 'get' &&
        response.config?.params &&
        Object.prototype.hasOwnProperty.call(response.config.params, 'page')

      const isPermissionListRequest =
        response.config?.url?.includes('/api/permissions') &&
        !response.config?.url?.includes('/api/permissions/pages') &&
        !response.config?.url?.includes('/api/permissions/roles') &&
        String(response.config?.method).toLowerCase() === 'get' &&
        response.config?.params &&
        Object.prototype.hasOwnProperty.call(response.config.params, 'page')

      const isRolePermissionRequest =
        response.config?.url?.includes('/api/permissions/roles') &&
        String(response.config?.method).toLowerCase() === 'get'

      // 约定：code 为 0 或 200 视为成功，其它视为错误
      const successCodes = [0, 200]

      // 如果返回的 code 不在成功列表中，说明有错误
      if (!successCodes.includes(res.code)) {
        // 对于登录接口，显示后端返回的错误信息
        if (isLoginRequest) {
          ElMessage.error(res.message || '登录失败，请检查用户名和密码')
        } else {
          ElMessage.error(res.message || '请求失败')
        }
        
        // 如果是 401 未授权，清除 token 并跳转到登录页（非登录接口）
        if (res.code === 401 && !isLoginRequest) {
          localStorage.removeItem(config.tokenKey)
          localStorage.removeItem(config.userInfoKey)
          router.push('/login')
        }
        
        return Promise.reject(new Error(res.message || '请求失败'))
      }

      // code === 200
      // 登录接口：返回完整结构，包含 token
      if (isLoginRequest) {
        return res
      }

      // 列表接口（分页）：返回完整结构，包含 data/total/page 等分页信息
      if (isUserListRequest || isRoleListRequest || isDepartmentListRequest || 
          isPageListRequest || isPermissionListRequest || isRolePermissionRequest) {
        return res
      }

      // 其他接口：优先返回 data 字段
      return 'data' in res ? res.data : res
    }
    
    // 没有 code 字段时，认为是普通接口，直接返回
    return res
  },
  error => {
    console.error('响应错误:', error)
    
    // 处理 HTTP 错误状态码
    if (error.response) {
      const status = error.response.status
      const responseData = error.response.data
      
      switch (status) {
        case 401:
          // 检查是否是登录接口，如果是则显示更友好的提示
          const isLoginRequest = error.config?.url?.includes('/api/login')
          if (isLoginRequest) {
            // 登录接口的 401 通常是用户名或密码错误
            ElMessage.error(responseData?.message || '用户名或密码错误')
          } else {
            // 其他接口的 401 表示未授权
            ElMessage.error('未授权，请重新登录')
            localStorage.removeItem(config.tokenKey)
            localStorage.removeItem(config.userInfoKey)
            router.push('/login')
          }
          break
        case 403:
          // 显示后端返回的详细错误信息
          const errorMessage403 = responseData?.detail || responseData?.message || '拒绝访问'
          ElMessage.error(errorMessage403)
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          // 优先显示后端返回的错误信息
          const errorMessageDefault = responseData?.message || responseData?.error || '请求失败'
          ElMessage.error(errorMessageDefault)
      }
    } else if (error.request) {
      // 检查是否是连接被拒绝（后端服务未启动）
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        ElMessage.error(`无法连接到后端服务，请确保后端服务已启动（${config.baseURL}）`)
      } else {
        ElMessage.error('网络错误，请检查网络连接')
      }
    } else {
      ElMessage.error(error.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)

export default service

