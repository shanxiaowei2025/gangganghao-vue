<template>
  <div class="role-manage">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="card-header">
        <h3 class="card-title">角色查询</h3>
        <el-button type="primary" @click="openCreateDialog">
          <el-icon><Plus /></el-icon>
          新建角色
        </el-button>
      </div>
      <el-form
        :model="searchForm"
        label-width="80px"
        class="search-form"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="角色名称">
              <el-input
                v-model="searchForm.role_name"
                placeholder="请输入角色名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>
                查询
              </el-button>
              <el-button @click="handleReset">
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 列表区域 -->
    <el-card class="table-card" shadow="never">
      <el-table
        :data="roleList"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="role_name" label="角色名称" min-width="150" />
        <el-table-column prop="description" label="角色描述" min-width="200" />
        <el-table-column
          prop="created_at"
          label="创建时间"
          min-width="180"
        />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              text
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              type="primary"
              text
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              text
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50]"
          :total="total"
          v-model:current-page="page"
          v-model:page-size="pageSize"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </el-card>

    <!-- 新建 / 编辑角色对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑角色' : '新建角色'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="role_name">
          <el-input
            v-model="editForm.role_name"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述（可选）"
          />
        </el-form-item>
        <el-form-item 
          v-if="!isEdit" 
          label="分配权限" 
          prop="permission_ids"
        >
          <div class="permission-select-wrapper">
            <el-tree
              ref="permissionTreeRef"
              :data="permissionTreeData"
              :props="{ children: 'children', label: 'label' }"
              show-checkbox
              node-key="id"
              :default-checked-keys="editForm.permission_ids"
              @check="handlePermissionTreeCheck"
              class="permission-tree"
            />
            <div v-if="permissionTreeData.length === 0" class="empty-tip">
              正在加载权限数据...
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="角色详情"
      width="520px"
      destroy-on-close
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">
          {{ currentRole?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="角色名称">
          {{ currentRole?.role_name }}
        </el-descriptions-item>
        <el-descriptions-item label="角色描述">
          {{ currentRole?.description || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentRole?.created_at }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">
          关 闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import {
  createRole,
  getRoleList,
  getRoleDetail,
  updateRole,
  deleteRole
} from '@/api/role'
import { getPageList, getPermissionList } from '@/api/permission'

const loading = ref(false)
const roleList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

const searchForm = reactive({
  role_name: ''
})

const editDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const editFormRef = ref(null)
const permissionTreeRef = ref(null)

const editForm = reactive({
  id: null,
  role_name: '',
  description: '',
  permission_ids: []
})

const editRules = {
  role_name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ]
}

const currentRole = ref(null)

// 权限树数据
const permissionTreeData = ref([])

// 构建权限树数据
const buildPermissionTree = (pages, permissions) => {
  const tree = []
  pages.forEach(page => {
    const pagePermissions = permissions.filter(p => p.page?.id === page.id)
    if (pagePermissions.length > 0) {
      tree.push({
        id: `page_${page.id}`,
        label: page.page_display_name,
        children: pagePermissions.map(p => ({
          id: p.id,
          label: `${p.permission_name} (${p.permission_code})`
        }))
      })
    }
  })
  return tree
}

// 加载权限树数据
const loadPermissionTree = async () => {
  try {
    const [pagesRes, permissionsRes] = await Promise.all([
      getPageList({ page: 1, pagesize: 1000 }),
      getPermissionList({ page: 1, pagesize: 1000 })
    ])
    
    const pages = Array.isArray(pagesRes.data) ? pagesRes.data : []
    const permissions = Array.isArray(permissionsRes.data) ? permissionsRes.data : []
    
    permissionTreeData.value = buildPermissionTree(pages, permissions)
  } catch (error) {
    console.error('加载权限数据失败:', error)
    permissionTreeData.value = []
  }
}

const handlePermissionTreeCheck = () => {
  // 树节点选中状态改变时的处理
  if (permissionTreeRef.value) {
    const checkedNodes = permissionTreeRef.value.getCheckedNodes(false, true)
    editForm.permission_ids = checkedNodes
      .filter(node => typeof node.id === 'number')
      .map(node => node.id)
  }
}

// 加载角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pagesize: pageSize.value,
      ...searchForm
    }
    const res = await getRoleList(params)

    const list = Array.isArray(res.data) ? res.data : []
    roleList.value = list
    total.value = Number(res.total) || list.length
  } catch (error) {
    console.error('获取角色列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = page.value || 1
  fetchRoleList()
}

const handleReset = () => {
  searchForm.role_name = ''
  page.value = 1
  fetchRoleList()
}

const openCreateDialog = async () => {
  isEdit.value = false
  await loadPermissionTree()
  Object.assign(editForm, {
    id: null,
    role_name: '',
    description: '',
    permission_ids: []
  })
  editDialogVisible.value = true
  // 清空树的选择状态
  if (permissionTreeRef.value) {
    permissionTreeRef.value.setCheckedKeys([])
  }
}

const handleEdit = async (row) => {
  isEdit.value = true
  try {
    const detail = await getRoleDetail(row.id)
    Object.assign(editForm, {
      id: detail.id,
      role_name: detail.role_name,
      description: detail.description || ''
    })
    editDialogVisible.value = true
  } catch (error) {
    console.error('获取角色详情失败:', error)
  }
}

const handleView = async (row) => {
  try {
    const detail = await getRoleDetail(row.id)
    currentRole.value = detail
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取角色详情失败:', error)
  }
}

const handleSave = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (isEdit.value) {
        const payload = {
          role_name: editForm.role_name,
          description: editForm.description || null
        }
        await updateRole(editForm.id, payload)
        ElMessage.success('角色更新成功')
      } else {
        const payload = {
          role_name: editForm.role_name,
          description: editForm.description || null,
          permission_ids: editForm.permission_ids || []
        }
        await createRole(payload)
        ElMessage.success('角色创建成功')
      }
      editDialogVisible.value = false
      fetchRoleList()
    } catch (error) {
      console.error('保存角色失败:', error)
      ElMessage.error(error.response?.data?.message || error.message || '保存角色失败')
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除角色【${row.role_name}】吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await deleteRole(row.id)
        ElMessage.success('删除成功')
        fetchRoleList()
      } catch (error) {
        console.error('删除角色失败:', error)
        ElMessage.error(error.response?.data?.message || error.message || '删除角色失败')
      }
    })
    .catch(() => {})
}

onMounted(() => {
  fetchRoleList()
})
</script>

<style scoped>
.role-manage {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.permission-select-wrapper {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #fafafa;
}

.permission-tree {
  background-color: transparent;
}

.empty-tip {
  text-align: center;
  color: #909399;
  padding: 20px;
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

