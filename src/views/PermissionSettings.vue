<template>
  <div class="permission-manage">
    <!-- 页面选择 -->
    <el-card class="search-card" shadow="never">
      <div class="card-header">
        <h3 class="card-title">权限管理</h3>
        <el-button type="primary" @click="handleSaveAll">
          <el-icon><Check /></el-icon>
          保存所有权限
        </el-button>
      </div>
      <el-form
        :model="searchForm"
        label-width="80px"
        class="search-form"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="选择页面">
              <el-select
                v-model="selectedPageId"
                placeholder="请选择页面"
                clearable
                style="width: 100%"
                @change="handlePageChange"
              >
                <el-option
                  v-for="page in pageList"
                  :key="page.id"
                  :label="page.page_display_name"
                  :value="page.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 权限矩阵表格 -->
    <el-card class="table-card" shadow="never" v-if="selectedPageId">
      <div class="matrix-container">
        <el-table
          :data="roleList"
          border
          style="width: 100%"
          v-loading="loading"
          class="permission-matrix-table"
        >
          <!-- 角色列 -->
          <el-table-column prop="role_name" label="角色" width="180" fixed="left">
            <template #default="scope">
              <div class="role-name">{{ scope.row.role_name }}</div>
            </template>
          </el-table-column>

          <!-- 权限操作列 -->
          <el-table-column
            v-for="permission in permissionColumns"
            :key="permission.code"
            :label="permission.label"
            :width="permission.width"
            align="center"
          >
            <template #default="scope">
              <el-switch
                :model-value="permissionMatrix[scope.row.id]?.[permission.code] || false"
                @update:model-value="(val) => handlePermissionSwitchChange(scope.row.id, permission.code, val)"
                :active-value="true"
                :inactive-value="false"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 空状态 -->
    <el-card class="table-card" shadow="never" v-else>
      <el-empty description="请先选择页面" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { getPageList } from '@/api/permission'
import { getRoleList } from '@/api/role'
import { getRolePermissions, assignPermissionsToRole } from '@/api/permission'

const loading = ref(false)
const pageList = ref([])
const roleList = ref([])
const selectedPageId = ref(null)
const selectedPage = ref(null)

const searchForm = reactive({})

// 权限列定义
const permissionColumns = [
  { code: 'create', label: '创建', width: 100 },
  { code: 'delete', label: '删除', width: 100 },
  { code: 'edit', label: '编辑', width: 100 },
  { code: 'view_all', label: '查看所有', width: 120 },
  { code: 'view_local', label: '查看本地', width: 120 },
  { code: 'view_self', label: '查看自己', width: 120 }
]

// 权限矩阵：{ roleId: { permissionCode: boolean } }
const permissionMatrix = ref({})

// 变更记录：记录哪些角色的权限发生了变化
const changes = ref({})

// 加载页面列表
const loadPageList = async () => {
  try {
    const res = await getPageList({ page: 1, pagesize: 1000 })
    pageList.value = Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error('获取页面列表失败:', error)
    ElMessage.error('获取页面列表失败')
  }
}

// 加载角色列表
const loadRoleList = async () => {
  try {
    const res = await getRoleList({ page: 1, pagesize: 1000 })
    roleList.value = Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  }
}

// 根据权限代码获取权限ID
const getPermissionIdByCode = (permissionCode, pageId) => {
  // 这里需要根据实际的权限代码规则来匹配
  // 假设权限代码格式为：page_name:action
  if (!selectedPage.value) return null
  
  const pageName = selectedPage.value.page_name
  const fullCode = `${pageName}:${permissionCode}`
  
  // 从权限列表中查找匹配的权限ID
  // 这里需要先加载该页面的所有权限
  // 暂时返回null，后续需要实现
  return null
}

// 页面改变时加载权限矩阵
const handlePageChange = async (pageId) => {
  if (!pageId) {
    permissionMatrix.value = {}
    changes.value = {}
    selectedPage.value = null
    return
  }

  selectedPage.value = pageList.value.find(p => p.id === pageId)
  if (!selectedPage.value) return

  loading.value = true
  try {
    // 先加载该页面的所有权限
    const pagePermissions = await loadPagePermissions(pageId)
    
    // 初始化权限矩阵
    const matrix = {}
    for (const role of roleList.value) {
      matrix[role.id] = {}
      for (const perm of permissionColumns) {
        matrix[role.id][perm.code] = false
      }
    }

    // 加载每个角色的权限
    await Promise.all(
      roleList.value.map(async (role) => {
        try {
          const res = await getRolePermissions(role.id)
          let rolePermissions = []
          
          if (res.data) {
            if (Array.isArray(res.data)) {
              rolePermissions = res.data
            } else if (res.data.permissions) {
              rolePermissions = res.data.permissions
            }
          }

          // 过滤出当前页面的权限ID
          const rolePermissionIds = rolePermissions
            .filter(p => p.page?.id === pageId || p.page_id === pageId)
            .map(p => p.id)

          // 更新矩阵：检查角色是否有对应的权限
          for (const perm of permissionColumns) {
            // 查找匹配的权限
            const matchedPermission = pagePermissions.find(p => {
              const code = p.permission_code || ''
              // 匹配规则：包含权限代码或以权限代码结尾
              return code.includes(perm.code) || 
                     code.endsWith(`:${perm.code}`) ||
                     code === perm.code
            })
            
            if (matchedPermission) {
              matrix[role.id][perm.code] = rolePermissionIds.includes(matchedPermission.id)
            }
          }
        } catch (error) {
          console.error(`获取角色 ${role.role_name} 的权限失败:`, error)
        }
      })
    )

    permissionMatrix.value = matrix
    changes.value = {}
  } catch (error) {
    console.error('加载权限矩阵失败:', error)
    ElMessage.error('加载权限矩阵失败')
  } finally {
    loading.value = false
  }
}

// 权限开关改变
const handlePermissionSwitchChange = (roleId, permissionCode, value) => {
  // 确保矩阵中存在该角色的记录
  if (!permissionMatrix.value[roleId]) {
    permissionMatrix.value[roleId] = {}
  }
  // 更新矩阵值
  permissionMatrix.value[roleId][permissionCode] = value
  // 记录变更
  if (!changes.value[roleId]) {
    changes.value[roleId] = {}
  }
  changes.value[roleId][permissionCode] = value
}

// 保存所有权限
const handleSaveAll = async () => {
  if (!selectedPageId.value) {
    ElMessage.warning('请先选择页面')
    return
  }

  if (Object.keys(changes.value).length === 0) {
    ElMessage.info('没有需要保存的变更')
    return
  }

  loading.value = true
  try {
    // 获取当前页面的所有权限
    const pageName = selectedPage.value.page_name
    const allPermissions = await loadPagePermissions(selectedPageId.value)
    
    // 为每个有变更的角色更新权限
    const updatePromises = Object.keys(changes.value).map(async (roleId) => {
      const roleChanges = changes.value[roleId]
      const roleIdNum = Number(roleId)
      
      // 获取角色当前权限
      const res = await getRolePermissions(roleIdNum)
      let currentPermissions = []
      
      if (res.data) {
        if (Array.isArray(res.data)) {
          currentPermissions = res.data
        } else if (res.data.permissions) {
          currentPermissions = res.data.permissions
        }
      }

      // 过滤出非当前页面的权限（保留其他页面的权限）
      const otherPagePermissions = currentPermissions.filter(p => 
        p.page?.id !== selectedPageId.value && p.page_id !== selectedPageId.value
      )

      // 构建新的权限列表
      const newPermissionIds = []
      
      // 添加其他页面的权限
      otherPagePermissions.forEach(p => {
        if (p.id) newPermissionIds.push(p.id)
      })

      // 添加当前页面的权限（根据矩阵状态）
      for (const perm of permissionColumns) {
        if (permissionMatrix.value[roleIdNum]?.[perm.code]) {
          // 查找对应的权限ID
          const permission = allPermissions.find(p => {
            const code = p.permission_code || ''
            // 匹配规则：包含权限代码或以权限代码结尾
            return code.includes(perm.code) || 
                   code.endsWith(`:${perm.code}`) ||
                   code === perm.code
          })
          if (permission && permission.id) {
            newPermissionIds.push(permission.id)
          }
        }
      }

      // 更新角色权限
      await assignPermissionsToRole(roleIdNum, {
        role_id: roleIdNum,
        permission_ids: newPermissionIds
      })
    })

    await Promise.all(updatePromises)
    
    ElMessage.success('权限保存成功')
    changes.value = {}
  } catch (error) {
    console.error('保存权限失败:', error)
    ElMessage.error(error.response?.data?.message || error.message || '保存权限失败')
  } finally {
    loading.value = false
  }
}

// 加载页面权限
const loadPagePermissions = async (pageId) => {
  try {
    const { getPermissionList } = await import('@/api/permission')
    const res = await getPermissionList({ page_id: pageId, page: 1, pagesize: 1000 })
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error('获取页面权限失败:', error)
    return []
  }
}

onMounted(async () => {
  await Promise.all([loadPageList(), loadRoleList()])
})
</script>

<style scoped>
.permission-manage {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.search-form {
  margin-top: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.search-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.table-card {
  flex: 1;
}

.matrix-container {
  overflow-x: auto;
}

.permission-matrix-table {
  min-width: 800px;
}

.role-name {
  font-weight: 500;
  color: #303133;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
  text-align: center;
}

:deep(.el-table td) {
  text-align: center;
}

:deep(.el-switch) {
  --el-switch-on-color: #409eff;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .card-header .el-button {
    width: 100%;
  }
}
</style>
