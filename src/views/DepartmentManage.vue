<template>
  <div class="department-manage">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="card-header">
        <h3 class="card-title">部门查询</h3>
        <el-button type="primary" @click="openCreateDialog">
          <el-icon><Plus /></el-icon>
          新建部门
        </el-button>
      </div>
      <el-form
        :model="searchForm"
        label-width="80px"
        class="search-form"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="部门名称">
              <el-input
                v-model="searchForm.department_name"
                placeholder="请输入部门名称"
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
        :data="departmentList"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="department_name" label="部门名称" min-width="150" />
        <el-table-column prop="description" label="部门描述" min-width="200" />
        <el-table-column label="父部门" min-width="120">
          <template #default="scope">
            {{ getParentDepartmentName(scope.row.parent_id) || '-' }}
          </template>
        </el-table-column>
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

    <!-- 新建 / 编辑部门对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑部门' : '新建部门'"
      width="520px"
      destroy-on-close
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="90px"
      >
        <el-form-item label="部门名称" prop="department_name">
          <el-input
            v-model="editForm.department_name"
            placeholder="请输入部门名称"
          />
        </el-form-item>
        <el-form-item label="部门描述" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入部门描述（可选）"
          />
        </el-form-item>
        <el-form-item label="父部门" prop="parent_id">
          <el-select
            v-model="editForm.parent_id"
            placeholder="请选择父部门（可选）"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="dept in allDepartmentList"
              :key="dept.id"
              :label="dept.department_name"
              :value="dept.id"
              :disabled="isEdit && dept.id === editForm.id"
            />
          </el-select>
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
      title="部门详情"
      width="520px"
      destroy-on-close
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">
          {{ currentDepartment?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="部门名称">
          {{ currentDepartment?.department_name }}
        </el-descriptions-item>
        <el-descriptions-item label="部门描述">
          {{ currentDepartment?.description || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="父部门">
          {{ getParentDepartmentName(currentDepartment?.parent_id) || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentDepartment?.created_at }}
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
  createDepartment,
  getDepartmentList,
  getDepartmentDetail,
  updateDepartment,
  deleteDepartment
} from '@/api/department'

const loading = ref(false)
const departmentList = ref([])
const allDepartmentList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

const searchForm = reactive({
  department_name: ''
})

const editDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const editFormRef = ref(null)

const editForm = reactive({
  id: null,
  department_name: '',
  description: '',
  parent_id: null
})

const editRules = {
  department_name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' }
  ]
}

const currentDepartment = ref(null)

// 获取父部门名称
const getParentDepartmentName = (parentId) => {
  if (!parentId) return null
  const parent = allDepartmentList.value.find(dept => dept.id === parentId)
  return parent ? parent.department_name : null
}

// 加载所有部门列表（用于父部门选择）
const loadAllDepartments = async () => {
  try {
    const res = await getDepartmentList({ page: 1, pagesize: 1000 })
    allDepartmentList.value = Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error('获取部门列表失败:', error)
    allDepartmentList.value = []
  }
}

// 加载部门列表
const fetchDepartmentList = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pagesize: pageSize.value,
      ...searchForm
    }
    const res = await getDepartmentList(params)

    const list = Array.isArray(res.data) ? res.data : []
    departmentList.value = list
    total.value = Number(res.total) || list.length
  } catch (error) {
    console.error('获取部门列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = page.value || 1
  fetchDepartmentList()
}

const handleReset = () => {
  searchForm.department_name = ''
  page.value = 1
  fetchDepartmentList()
}

const openCreateDialog = async () => {
  isEdit.value = false
  await loadAllDepartments()
  Object.assign(editForm, {
    id: null,
    department_name: '',
    description: '',
    parent_id: null
  })
  editDialogVisible.value = true
}

const handleEdit = async (row) => {
  isEdit.value = true
  try {
    await loadAllDepartments()
    const detail = await getDepartmentDetail(row.id)
    Object.assign(editForm, {
      id: detail.id,
      department_name: detail.department_name,
      description: detail.description || '',
      parent_id: detail.parent_id || null
    })
    editDialogVisible.value = true
  } catch (error) {
    console.error('获取部门详情失败:', error)
  }
}

const handleView = async (row) => {
  try {
    await loadAllDepartments()
    const detail = await getDepartmentDetail(row.id)
    currentDepartment.value = detail
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取部门详情失败:', error)
  }
}

const handleSave = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (isEdit.value) {
        const payload = {
          department_name: editForm.department_name,
          description: editForm.description || null,
          parent_id: editForm.parent_id || null
        }
        await updateDepartment(editForm.id, payload)
        ElMessage.success('部门更新成功')
      } else {
        const payload = {
          department_name: editForm.department_name,
          description: editForm.description || null,
          parent_id: editForm.parent_id || null
        }
        await createDepartment(payload)
        ElMessage.success('部门创建成功')
      }
      editDialogVisible.value = false
      fetchDepartmentList()
      loadAllDepartments()
    } catch (error) {
      console.error('保存部门失败:', error)
      ElMessage.error(error.response?.data?.message || error.message || '保存部门失败')
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除部门【${row.department_name}】吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await deleteDepartment(row.id)
        ElMessage.success('删除成功')
        fetchDepartmentList()
        loadAllDepartments()
      } catch (error) {
        console.error('删除部门失败:', error)
        ElMessage.error(error.response?.data?.message || error.message || '删除部门失败')
      }
    })
    .catch(() => {})
}

onMounted(() => {
  fetchDepartmentList()
  loadAllDepartments()
})
</script>

<style scoped>
.department-manage {
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

