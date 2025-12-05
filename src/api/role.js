import request from '@/utils/api'

// ================= 角色管理 =================

// 创建角色
export function createRole(data) {
  return request({
    url: '/api/roles',
    method: 'post',
    data
  })
}

// 获取角色列表（分页 + 查询）
export function getRoleList(params) {
  return request({
    url: '/api/roles',
    method: 'get',
    params
  })
}

// 获取角色详情
export function getRoleDetail(roleId) {
  return request({
    url: `/api/roles/${roleId}`,
    method: 'get'
  })
}

// 更新角色信息（部分更新）
export function updateRole(roleId, data) {
  return request({
    url: `/api/roles/${roleId}`,
    method: 'patch',
    data
  })
}

// 删除角色
export function deleteRole(roleId) {
  return request({
    url: `/api/roles/${roleId}`,
    method: 'delete'
  })
}

