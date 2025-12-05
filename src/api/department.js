import request from '@/utils/api'

// ================= 部门管理 =================

// 创建部门
export function createDepartment(data) {
  return request({
    url: '/api/departments',
    method: 'post',
    data
  })
}

// 获取部门列表（分页 + 查询）
export function getDepartmentList(params) {
  return request({
    url: '/api/departments',
    method: 'get',
    params
  })
}

// 获取部门详情
export function getDepartmentDetail(deptId) {
  return request({
    url: `/api/departments/${deptId}`,
    method: 'get'
  })
}

// 更新部门信息（部分更新）
export function updateDepartment(deptId, data) {
  return request({
    url: `/api/departments/${deptId}`,
    method: 'patch',
    data
  })
}

// 删除部门
export function deleteDepartment(deptId) {
  return request({
    url: `/api/departments/${deptId}`,
    method: 'delete'
  })
}

