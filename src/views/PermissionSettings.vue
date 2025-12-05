<template>
  <div class="permission-manage">
    <!-- 顶部卡片：标题和操作按钮 -->
    <el-card class="header-card" shadow="never">
      <div class="header-content">
        <div class="title-section">
          <h2 class="page-title">权限管理</h2>
          <p class="page-desc">管理各角色在不同页面的权限配置</p>
        </div>
        <el-button 
          type="primary" 
          size="large"
          @click="handleSaveAll"
          :loading="saving"
          :disabled="!hasChanges"
        >
          <el-icon><Check /></el-icon>
          保存所有修改
        </el-button>
      </div>
    </el-card>

    <!-- 页面选择卡片 -->
    <el-card class="menu-selector-card" shadow="never">
      <div class="menu-selector">
        <div class="selector-label">
          <el-icon class="label-icon"><Menu /></el-icon>
          <span>选择菜单页面</span>
        </div>
        <el-segmented 
          v-model="selectedPageId" 
          :options="pageOptions"
          size="large"
          @change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 权限矩阵表格 -->
    <el-card class="table-card" shadow="never" v-if="selectedPageId">
      <div class="table-header">
        <div class="table-title-section">
          <h3 class="table-title">{{ currentPageName }}</h3>
          <el-tag :type="hasChanges ? 'warning' : 'success'" size="large">
            {{ hasChanges ? '有未保存的修改' : '已保存' }}
          </el-tag>
        </div>
        <div class="table-info">
          共 <span class="count">{{ roleList.length }}</span> 个角色，
          <span class="count">{{ permissionColumns.length }}</span> 种权限类型
        </div>
      </div>

      <div class="matrix-container">
        <el-table
          :data="roleList"
          style="width: 100%"
          v-loading="loading"
          class="permission-matrix-table"
          :border="false"
          :stripe="true"
        >
          <!-- 角色列 -->
          <el-table-column prop="role_name" label="角色名称" width="200" fixed="left">
            <template #default="scope">
              <div class="role-cell">
                <el-icon class="role-icon"><UserFilled /></el-icon>
                <span class="role-name">{{ scope.row.role_name }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- 权限操作列 -->
          <el-table-column
            v-for="permission in permissionColumns"
            :key="permission.code"
            :label="permission.label"
            min-width="120"
            align="center"
          >
            <template #header>
              <div class="permission-header">
                <el-icon :class="'permission-icon ' + permission.iconClass">
                  <component :is="permission.icon" />
                </el-icon>
                <span>{{ permission.label }}</span>
              </div>
            </template>
            <template #default="scope">
              <el-switch
                :model-value="permissionMatrix[scope.row.id]?.[permission.code] || false"
                @update:model-value="(val) => handlePermissionSwitchChange(scope.row.id, permission.code, val)"
                :active-value="true"
                :inactive-value="false"
                size="large"
                inline-prompt
                :active-text="'开'"
                :inactive-text="'关'"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 空状态 -->
    <el-card class="empty-card" shadow="never" v-else>
      <el-empty description="请先选择菜单页面查看权限配置">
        <template #image>
          <el-icon class="empty-icon"><Menu /></el-icon>
        </template>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Check, 
  Menu, 
  UserFilled, 
  Plus, 
  Delete, 
  Edit, 
  View, 
  Lock 
} from '@element-plus/icons-vue'
import { getPageList } from '@/api/permission'
import { getRoleList } from '@/api/role'
import { getRolePermissions, assignPermissionsToRole } from '@/api/permission'

const loading = ref(false)
const saving = ref(false)
const pageList = ref([])
const roleList = ref([])
const selectedPageId = ref(null)
const selectedPage = ref(null)

// 权限列定义（带图标）
const permissionColumns = [
  { 
    code: 'create', 
    label: '创建', 
    icon: Plus,
    iconClass: 'icon-create'
  },
  { 
    code: 'delete', 
    label: '删除', 
    icon: Delete,
    iconClass: 'icon-delete'
  },
  { 
    code: 'edit', 
    label: '编辑', 
    icon: Edit,
    iconClass: 'icon-edit'
  },
  { 
    code: 'view_all', 
    label: '查看所有', 
    icon: View,
    iconClass: 'icon-view-all'
  },
  { 
    code: 'view_local', 
    label: '查看本地', 
    icon: View,
    iconClass: 'icon-view-local'
  },
  { 
    code: 'view_self', 
    label: '查看自己', 
    icon: Lock,
    iconClass: 'icon-view-self'
  }
]

// 权限矩阵：{ roleId: { permissionCode: boolean } }
const permissionMatrix = ref({})

// 变更记录：记录哪些角色的权限发生了变化
const changes = ref({})

// 计算属性：页面选项（用于Segmented组件）
const pageOptions = computed(() => {
  return pageList.value.map(page => ({
    label: page.page_display_name || page.page_name,
    value: page.id
  }))
})

// 计算属性：当前页面名称
const currentPageName = computed(() => {
  if (!selectedPage.value) return ''
  return selectedPage.value.page_display_name || selectedPage.value.page_name
})

// 计算属性：是否有未保存的修改
const hasChanges = computed(() => {
  return Object.keys(changes.value).length > 0
})

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

  saving.value = true
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
    saving.value = false
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
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 顶部卡片样式 */
.header-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.title-section {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

/* 菜单选择器卡片 */
.menu-selector-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: none;
}

.menu-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.selector-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #606266;
}

.label-icon {
  font-size: 18px;
  color: #409eff;
}

/* 表格卡片 */
.table-card {
  border-radius: 12px;
  border: none;
}

.table-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.table-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.table-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.table-info {
  font-size: 14px;
  color: #909399;
}

.count {
  font-weight: 600;
  color: #409eff;
  font-size: 16px;
}

/* 表格样式 */
.matrix-container {
  overflow-x: auto;
  border-radius: 8px;
}

.permission-matrix-table {
  border-radius: 8px;
  overflow: hidden;
}

/* 角色单元格 */
.role-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.role-icon {
  font-size: 20px;
  color: #409eff;
}

.role-name {
  font-weight: 500;
  color: #303133;
  font-size: 15px;
}

/* 权限列表头 */
.permission-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 500;
}

.permission-icon {
  font-size: 16px;
}

.icon-create {
  color: #67c23a;
}

.icon-delete {
  color: #f56c6c;
}

.icon-edit {
  color: #e6a23c;
}

.icon-view-all {
  color: #409eff;
}

.icon-view-local {
  color: #909399;
}

.icon-view-self {
  color: #606266;
}

/* 表格深度样式 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th.el-table__cell) {
  background-color: #fafafa;
  color: #606266;
  font-weight: 500;
  padding: 16px 0;
}

:deep(.el-table td.el-table__cell) {
  padding: 14px 0;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #fafbfc;
}

:deep(.el-table__body tr:hover > td) {
  background-color: #f5f7fa !important;
}

:deep(.el-switch) {
  --el-switch-on-color: #409eff;
  --el-switch-off-color: #dcdfe6;
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #409eff;
  background-color: #409eff;
}

:deep(.el-switch__core) {
  height: 24px;
  min-width: 50px;
}

:deep(.el-switch__inner) {
  font-size: 12px;
}

/* Segmented 样式 */
:deep(.el-segmented) {
  background-color: #f5f7fa;
  padding: 4px;
}

:deep(.el-segmented__item) {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-segmented__item.is-selected) {
  background-color: #409eff;
  color: #fff;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
}

/* 空状态 */
.empty-card {
  border-radius: 12px;
  border: none;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 80px;
  color: #dcdfe6;
}

/* 响应式 */
@media (max-width: 768px) {
  .permission-manage {
    padding: 12px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .page-title {
    font-size: 20px;
  }

  .menu-selector {
    gap: 12px;
  }

  :deep(.el-segmented) {
    flex-wrap: wrap;
  }

  .table-header {
    margin-bottom: 16px;
  }

  .table-title-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
