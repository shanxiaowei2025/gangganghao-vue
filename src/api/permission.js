import request from '@/utils/api'

// ================= 页面管理 =================

// 创建页面
export function createPage(data) {
  return request({
    url: '/api/permissions/pages',
    method: 'post',
    data
  })
}

// 获取页面列表（分页 + 查询）
export function getPageList(params) {
  return request({
    url: '/api/permissions/pages',
    method: 'get',
    params
  })
}

// 获取页面详情
export function getPageDetail(pageId) {
  return request({
    url: `/api/permissions/pages/${pageId}`,
    method: 'get'
  })
}

// 更新页面信息（部分更新）
export function updatePage(pageId, data) {
  return request({
    url: `/api/permissions/pages/${pageId}`,
    method: 'patch',
    data
  })
}

// 删除页面
export function deletePage(pageId) {
  return request({
    url: `/api/permissions/pages/${pageId}`,
    method: 'delete'
  })
}

// ================= 权限管理 =================

// 创建权限
export function createPermission(data) {
  return request({
    url: '/api/permissions',
    method: 'post',
    data
  })
}

// 获取权限列表（分页 + 查询）
export function getPermissionList(params) {
  return request({
    url: '/api/permissions',
    method: 'get',
    params
  })
}

// 获取权限详情
export function getPermissionDetail(permissionId) {
  return request({
    url: `/api/permissions/${permissionId}`,
    method: 'get'
  })
}

// 更新权限信息（部分更新）
export function updatePermission(permissionId, data) {
  return request({
    url: `/api/permissions/${permissionId}`,
    method: 'patch',
    data
  })
}

// 删除权限
export function deletePermission(permissionId) {
  return request({
    url: `/api/permissions/${permissionId}`,
    method: 'delete'
  })
}

// ================= 角色权限分配 =================

// 为角色分配权限
export function assignPermissionsToRole(roleId, data) {
  return request({
    url: `/api/permissions/roles/${roleId}/assign`,
    method: 'post',
    data
  })
}

// 获取角色的权限列表
export function getRolePermissions(roleId) {
  return request({
    url: `/api/permissions/roles/${roleId}/permissions`,
    method: 'get'
  })
}

