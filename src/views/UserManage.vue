<template>
  <div class="user-manage">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="card-header">
        <h3 class="card-title">用户查询</h3>
        <el-button type="primary" @click="openCreateDialog">
          <el-icon><Plus /></el-icon>
          新建用户
        </el-button>
      </div>
      <el-form
        :model="searchForm"
        label-width="80px"
        class="search-form"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="账号">
              <el-input
                v-model="searchForm.username"
                placeholder="请输入账号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="姓名">
              <el-input
                v-model="searchForm.real_name"
                placeholder="请输入真实姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="身份证号">
              <el-input
                v-model="searchForm.id_card"
                placeholder="请输入身份证号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="手机号">
              <el-input
                v-model="searchForm.phone"
                placeholder="请输入手机号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="部门">
              <el-input
                v-model="searchForm.department"
                placeholder="请输入部门"
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
        :data="userList"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="账号" min-width="120" />
        <el-table-column prop="real_name" label="姓名" min-width="100" />
        <el-table-column prop="id_card" label="身份证号" min-width="180">
          <template #default="{ row }">
            {{ encryptIdCard(row.id_card) }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120">
          <template #default="{ row }">
            {{ encryptPhone(row.phone) }}
          </template>
        </el-table-column>
        <el-table-column label="部门" min-width="120">
          <template #default="scope">
            {{ scope.row.department?.department_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="140">
          <template #default="scope">
            {{ formatRoles(scope.row.roles) }}
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

    <!-- 新建 / 编辑用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑用户' : '新建用户'"
      width="520px"
      destroy-on-close
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="90px"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="editForm.username"
            :disabled="isEdit"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          v-if="!isEdit"
        >
          <el-input
            v-model="editForm.password"
            type="password"
            show-password
            placeholder="请输入密码（至少6位）"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="real_name">
          <el-input v-model="editForm.real_name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input
            v-model="editForm.id_card"
            placeholder="请输入身份证号"
            maxlength="18"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="editForm.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="部门" prop="department_id">
          <el-select
            v-model="editForm.department_id"
            placeholder="请选择部门"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.department_name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role_ids">
          <el-select
            v-model="editForm.role_ids"
            placeholder="请选择角色（可多选）"
            multiple
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.role_name || role.name || role.description"
              :value="role.id"
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
      title="用户详情"
      width="520px"
      destroy-on-close
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">
          {{ currentUser?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="账号">
          {{ currentUser?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="姓名">
          {{ currentUser?.real_name }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">
          {{ currentUser?.id_card }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ currentUser?.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ currentUser?.department?.department_name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="角色">
          {{ formatRoles(currentUser?.roles) }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentUser?.created_at }}
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
  createUser,
  getUserList,
  getUserDetail,
  updateUser,
  deleteUser,
  getDepartmentList,
  getRoleList
} from '@/api/user'
import { encryptIdCard, encryptPhone } from '@/utils/encrypt'

const loading = ref(false)
const userList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const departmentList = ref([])
const roleList = ref([])

const searchForm = reactive({
  username: '',
  real_name: '',
  id_card: '',
  phone: '',
  department: ''
})

const editDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const editFormRef = ref(null)

const editForm = reactive({
  id: null,
  username: '',
  password: '',
  real_name: '',
  id_card: '',
  phone: '',
  department_id: null,
  role_ids: []
})

const editRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      message: '密码长度不能少于6位',
      trigger: 'blur'
    }
  ],
  real_name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ]
}

const currentUser = ref(null)

const formatRoles = (roles) => {
  if (!roles || roles.length === 0) {
    return '-'
  }
  if (Array.isArray(roles)) {
    return roles
      .map((role) => role.role_name || role.description || role.name || role)
      .join('、')
  }
  return roles
}

// 加载用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pagesize: pageSize.value,
      ...searchForm
    }
    const res = await getUserList(params)

    // 后端返回结构：
    // {
    //   code: 200,
    //   message: '获取用户列表成功',
    //   data: [...],
    //   total: 11,
    //   page: 1,
    //   pagesize: 10
    // }
    const list = Array.isArray(res.data) ? res.data : []
    userList.value = list
    total.value = Number(res.total) || list.length
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = page.value || 1
  fetchUserList()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.real_name = ''
  searchForm.id_card = ''
  searchForm.phone = ''
  searchForm.department = ''
  page.value = 1
  fetchUserList()
}

const openCreateDialog = async () => {
  isEdit.value = false
  Object.assign(editForm, {
    id: null,
    username: '',
    password: '',
    real_name: '',
    id_card: '',
    phone: '',
    department_id: null,
    role_ids: []
  })
  // 加载部门和角色列表
  await loadDepartmentList()
  await loadRoleList()
  editDialogVisible.value = true
}

const handleEdit = async (row) => {
  isEdit.value = true
  try {
    const detail = await getUserDetail(row.id)
    // 加载部门和角色列表
    await loadDepartmentList()
    await loadRoleList()

    // 处理角色ID列表
    const roleIds = detail.roles && Array.isArray(detail.roles)
      ? detail.roles.map(role => role.id || role.role_id || role)
      : []

    Object.assign(editForm, {
      id: detail.id,
      username: detail.username,
      password: '',
      real_name: detail.real_name,
      id_card: detail.id_card,
      phone: detail.phone,
      department_id: detail.department_id || detail.department?.id || null,
      role_ids: roleIds
    })
    editDialogVisible.value = true
  } catch (error) {
    console.error('获取用户详情失败:', error)
  }
}

const handleView = async (row) => {
  try {
    const detail = await getUserDetail(row.id)
    currentUser.value = detail
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取用户详情失败:', error)
  }
}

const handleSave = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (isEdit.value) {
        const payload = {
          real_name: editForm.real_name,
          id_card: editForm.id_card,
          phone: editForm.phone,
          department_id: editForm.department_id,
          role_ids: editForm.role_ids || []
        }
        await updateUser(editForm.id, payload)
        ElMessage.success('用户更新成功')
      } else {
        const payload = {
          username: editForm.username,
          password: editForm.password,
          real_name: editForm.real_name,
          id_card: editForm.id_card,
          phone: editForm.phone,
          department_id: editForm.department_id,
          role_ids: editForm.role_ids || []
        }
        await createUser(payload)
        ElMessage.success('用户创建成功')
      }
      editDialogVisible.value = false
      fetchUserList()
    } catch (error) {
      console.error('保存用户失败:', error)
      ElMessage.error(error.response?.data?.message || error.message || '保存用户失败')
    }
  })
}

// 加载部门列表
const loadDepartmentList = async () => {
  try {
    const res = await getDepartmentList()
    // 处理返回数据，可能是数组或包含data字段的对象
    departmentList.value = Array.isArray(res) ? res : (res.data || res.list || [])
  } catch (error) {
    console.error('获取部门列表失败:', error)
    departmentList.value = []
  }
}

// 加载角色列表
const loadRoleList = async () => {
  try {
    const res = await getRoleList()
    // 处理返回数据，可能是数组或包含data字段的对象
    roleList.value = Array.isArray(res) ? res : (res.data || res.list || [])
  } catch (error) {
    console.error('获取角色列表失败:', error)
    roleList.value = []
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除用户【${row.username}】吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await deleteUser(row.id)
        ElMessage.success('删除成功')
        fetchUserList()
      } catch (error) {
        console.error('删除用户失败:', error)
        // 错误信息已经在API拦截器中显示，这里不需要再次显示
        // 但如果API拦截器没有处理，这里作为备用显示
        if (!error.response || error.response.status !== 403) {
          ElMessage.error(error.response?.data?.message || error.message || '删除用户失败')
        }
      }
    })
    .catch(() => {})
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-manage {
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

/* 响应式调整 */
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


