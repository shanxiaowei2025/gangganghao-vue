import request from '@/utils/api'

// 用户登录
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 获取当前登录用户信息
export function getUserProfile() {
  return request({
    url: '/api/auth/profile',
    method: 'get'
  })
}

// 更新当前登录用户信息（后端为 PATCH /api/auth/profile）
export function updateUserProfile(data) {
  return request({
    url: '/api/auth/profile',
    method: 'patch',
    data
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/api/auth/change-password',
    method: 'post',
    data
  })
}

// ================= 用户管理 =================

// 创建用户
export function createUser(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

// 获取用户列表（分页 + 查询）
export function getUserList(params) {
  return request({
    url: '/api/users',
    method: 'get',
    params
  })
}

// 获取用户详情
export function getUserDetail(userId) {
  return request({
    url: `/api/users/${userId}`,
    method: 'get'
  })
}

// 更新用户信息（部分更新）
export function updateUser(userId, data) {
  return request({
    url: `/api/users/${userId}`,
    method: 'patch',
    data
  })
}

// 删除用户
export function deleteUser(userId) {
  return request({
    url: `/api/users/${userId}`,
    method: 'delete'
  })
}

// 获取部门列表（用于下拉选择，不分页）
export function getDepartmentList(params) {
  return request({
    url: '/api/departments',
    method: 'get',
    params: params || {}
  })
}

// 获取角色列表（用于下拉选择，不分页）
export function getRoleList(params) {
  return request({
    url: '/api/roles',
    method: 'get',
    params: params || {}
  })
}

