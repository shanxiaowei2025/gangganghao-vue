<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <div class="user-info">
      <el-avatar :src="userInfo.avatar" :size="36">
        <el-icon><User /></el-icon>
      </el-avatar>
      <span class="username">{{ userInfo.real_name || userInfo.name || userInfo.username }}</span>
      <el-icon class="arrow-icon"><ArrowDown /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">
          <el-icon><User /></el-icon>
          个人资料
        </el-dropdown-item>
        <el-dropdown-item command="changePassword">
          <el-icon><User /></el-icon>
          修改密码
        </el-dropdown-item>
        <el-dropdown-item divided command="logout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!-- 修改个人资料对话框 -->
  <el-dialog
    v-model="profileDialogVisible"
    title="修改个人资料"
    width="500px"
  >
    <el-form
      ref="profileFormRef"
      :model="profileForm"
      :rules="profileRules"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="profileForm.username" disabled />
      </el-form-item>
      <el-form-item label="姓名" prop="real_name">
        <el-input v-model="profileForm.real_name" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="profileForm.phone" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input
          v-model="profileForm.idNumber"
          placeholder="请输入身份证号码"
          maxlength="18"
        />
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input v-model="profileForm.department" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="profileForm.avatar" placeholder="请输入头像URL" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="profileDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSaveProfile">保存</el-button>
    </template>
  </el-dialog>

  <!-- 修改密码对话框 -->
  <el-dialog
    v-model="passwordDialogVisible"
    title="修改密码"
    width="420px"
  >
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-width="90px"
    >
      <el-form-item label="旧密码" prop="old_password">
        <el-input
          v-model="passwordForm.old_password"
          type="password"
          show-password
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input
          v-model="passwordForm.new_password"
          type="password"
          show-password
          placeholder="请输入新密码（至少6位）"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password">
        <el-input
          v-model="passwordForm.confirm_password"
          type="password"
          show-password
          placeholder="请再次输入新密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="passwordDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleChangePassword">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import config from '@/config'
import { getUserProfile, updateUserProfile, changePassword } from '@/api/user'

const router = useRouter()
const profileFormRef = ref(null)
const profileDialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const passwordFormRef = ref(null)

const userInfo = reactive({
  id: '',
  username: '',
  real_name: '',
  name: '',
  phone: '',
  idNumber: '',
  id_card: '',
  department: '',
  roles: [],
  avatar: ''
})

const profileForm = reactive({
  username: '',
  real_name: '',
  name: '',
  phone: '',
  idNumber: '',
  id_card: '',
  department: '',
  avatar: ''
})

const passwordForm = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

const profileRules = {
  real_name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  idNumber: [
    {
      pattern: /(^\d{15}$)|(^\d{17}[\dXx]$)/,
      message: '请输入15或18位身份证号码',
      trigger: 'blur'
    }
  ]
}

const passwordRules = {
  old_password: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度不能少于6位', trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入新密码'))
        } else if (value !== passwordForm.new_password) {
          callback(new Error('两次输入的新密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 加载用户信息（优先从后端接口获取）
const loadUserInfo = async () => {
  try {
    // 调用后端接口获取当前用户资料
    const data = await getUserProfile()

    // data 结构参考：
    // {
    //   id, username, real_name, id_card, phone,
    //   department, roles, created_at
    // }

    const info = {
      ...data,
      // 前端内部统一使用 name / idNumber 字段
      name: data.real_name,
      idNumber: data.id_card,
      avatar:
        data.avatar ||
        'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }

    Object.assign(userInfo, info)

    // 同步到表单
    profileForm.username = info.username || ''
    profileForm.real_name = info.real_name || info.name || ''
    profileForm.name = info.real_name || info.name || ''
    profileForm.phone = info.phone || ''
    profileForm.idNumber = info.idNumber || info.id_card || ''
    profileForm.id_card = info.id_card || info.idNumber || ''
    profileForm.department = info.department || ''
    profileForm.avatar = info.avatar

    // 缓存到 localStorage，便于其他地方使用
    localStorage.setItem(config.userInfoKey, JSON.stringify(info))
  } catch (error) {
    console.error('获取用户信息失败:', error)

    // 如果接口失败，则回退到本地缓存（如果有）
    const userInfoStr = localStorage.getItem(config.userInfoKey)
    if (userInfoStr) {
      const info = JSON.parse(userInfoStr)
      Object.assign(userInfo, info)
      profileForm.username = info.username || ''
      profileForm.real_name = info.real_name || info.name || ''
      profileForm.name = info.real_name || info.name || ''
      profileForm.phone = info.phone || ''
      profileForm.idNumber = info.idNumber || info.id_card || ''
      profileForm.id_card = info.id_card || info.idNumber || ''
      profileForm.department = info.department || ''
      profileForm.avatar =
        info.avatar ||
        'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    } else {
      // 默认虚拟数据
      userInfo.username = 'admin'
      userInfo.real_name = '管理员'
      userInfo.name = '管理员'
      userInfo.avatar =
        'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      Object.assign(profileForm, {
        username: userInfo.username,
        real_name: userInfo.real_name,
        name: userInfo.name,
        phone: '',
        idNumber: '',
        id_card: '',
        department: '',
        avatar: userInfo.avatar
      })
    }
  }
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'profile') {
    profileDialogVisible.value = true
  } else if (command === 'changePassword') {
    passwordDialogVisible.value = true
  } else if (command === 'logout') {
    handleLogout()
  }
}

// 保存个人资料
const handleSaveProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 组装提交给后端的参数
        const payload = {
          real_name: profileForm.real_name,
          id_card: profileForm.idNumber || profileForm.id_card,
          phone: profileForm.phone,
          department: profileForm.department
        }

        // 调用后端接口更新用户资料
        await updateUserProfile(payload)

        // 同步更新 userInfo
        userInfo.real_name = profileForm.real_name
        userInfo.name = profileForm.real_name || profileForm.name
        userInfo.phone = profileForm.phone
        userInfo.idNumber = profileForm.idNumber || profileForm.id_card
        userInfo.id_card = payload.id_card
        userInfo.department = profileForm.department
        userInfo.avatar = profileForm.avatar
        
        // 保存到 localStorage
        localStorage.setItem(config.userInfoKey, JSON.stringify(userInfo))
        
        ElMessage.success('保存成功')
        profileDialogVisible.value = false
      } catch (error) {
        console.error('保存失败:', error)
      }
    }
  })
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const payload = {
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password
        }

        await changePassword(payload)

        ElMessage.success('密码修改成功，请使用新密码重新登录')

        // 清理本地密码表单
        passwordForm.old_password = ''
        passwordForm.new_password = ''
        passwordForm.confirm_password = ''
        passwordDialogVisible.value = false

        // 退出登录，强制重新登录
        localStorage.removeItem(config.tokenKey)
        localStorage.removeItem(config.userInfoKey)
        router.push('/login')
      } catch (error) {
        console.error('修改密码失败:', error)
      }
    }
  })
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 清除本地存储
    localStorage.removeItem(config.tokenKey)
    localStorage.removeItem(config.userInfoKey)
    
    ElMessage.success('退出成功')
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #606266;
}

.arrow-icon {
  font-size: 12px;
  color: #909399;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 8px;
}
</style>

