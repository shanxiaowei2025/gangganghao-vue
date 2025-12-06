<template>
  <el-container class="layout-container">
    <!-- 左侧导航栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <h3 v-if="!isCollapse">加工厂管理系统</h3>
        <h3 v-else>加工厂</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        class="sidebar-menu"
      >
        <!-- 动态菜单项 -->
        <template v-for="menu in menuList" :key="menu.id">
          <el-menu-item 
            v-if="!menu.children || menu.children.length === 0"
            :index="menu.route_path"
          >
            <el-icon><component :is="getMenuIcon(menu.page_name)" /></el-icon>
            <template #title>{{ menu.page_display_name || menu.page_name }}</template>
          </el-menu-item>
          
          <el-sub-menu 
            v-else
            :index="menu.id.toString()"
            :class="{ 'is-active': isSubMenuActive(menu) }"
          >
            <template #title>
              <el-icon><component :is="getMenuIcon(menu.page_name)" /></el-icon>
              <span>{{ menu.page_display_name || menu.page_name }}</span>
            </template>
            <el-menu-item 
              v-for="child in menu.children" 
              :key="child.id"
              :index="child.route_path"
            >
              <el-icon><component :is="getMenuIcon(child.page_name)" /></el-icon>
              <template #title>{{ child.page_display_name || child.page_name }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <!-- 右侧内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
        </div>
        <div class="header-right">
          <UserAvatar />
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Expand, 
  Fold, 
  Odometer, 
  User, 
  Box, 
  Document, 
  Tools, 
  Files, 
  Checked, 
  Upload, 
  Van, 
  Money, 
  DataLine, 
  Management, 
  Setting, 
  UserFilled, 
  OfficeBuilding, 
  Key, 
  Monitor 
} from '@element-plus/icons-vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { getPageList } from '@/api/permission'

const route = useRoute()
const isCollapse = ref(false)
const menuList = ref([])

const activeMenu = computed(() => {
  return route.path
})

// 菜单图标映射
const iconMap = {
  'dashboard': Odometer,
  'warehouse': Box,
  'orders': Document,
  'production': Tools,
  'materials': Files,
  'quality': Checked,
  'outbound': Upload,
  'delivery': Van,
  'settlement': Money,
  'finance': DataLine,
  'admin-center': Management,
  'system-settings': Setting,
  'users': User,
  'roles': UserFilled,
  'departments': OfficeBuilding,
  'permission': Key,
  'devices': Monitor
}

// 根据页面名称获取菜单图标
const getMenuIcon = (pageName) => {
  // 从 route_path 提取页面标识
  if (!pageName) return Odometer
  const key = pageName.toLowerCase().replace(/[_-]/g, '-')
  return iconMap[key] || Odometer
}

// 检测子菜单是否激活
const isSubMenuActive = (menu) => {
  if (!menu.children || menu.children.length === 0) return false
  return menu.children.some(child => child.route_path === route.path)
}

// 根据 page_name 生成 route_path
const generateRoutePath = (pageName) => {
  if (!pageName) return '/'
  // 将 page_name 转换为路由路径
  // 例如: dashboard -> /dashboard, material_manage -> /materials
  const pathMap = {
    'dashboard': '/dashboard',
    'warehouse': '/warehouse',
    'orders': '/orders',
    'production': '/production',
    'material_manage': '/materials',
    'quality_manage': '/quality',
    'outbound_manage': '/outbound',
    'delivery_manage': '/delivery',
    'settlement_manage': '/settlement',
    'finance_stats': '/finance',
    'admin_center': '/admin-center',
    'users': '/users',
    'roles': '/roles',
    'departments': '/departments',
    'permissions': '/permission',
    'device_manage': '/devices'
  }
  return pathMap[pageName] || `/${pageName.toLowerCase()}`
}

// 加载菜单列表
const loadMenuList = async () => {
  try {
    const res = await getPageList({ page: 1, pagesize: 1000 })
    const pages = Array.isArray(res.data) ? res.data : []
    
    // 为每个页面生成 route_path
    const pagesWithPath = pages.map(page => ({
      ...page,
      route_path: page.route_path || generateRoutePath(page.page_name)
    }))
    
    // 构建树形菜单结构：根据 parent_id 建立父子关系
    const menuMap = new Map()
    const rootMenus = []
    
    // 第一遍：将所有页面放入 map
    pagesWithPath.forEach(page => {
      menuMap.set(page.id, { ...page, children: [] })
    })
    
    // 第二遍：建立父子关系
    pagesWithPath.forEach(page => {
      if (page.parent_id === null || page.parent_id === undefined) {
        // 没有父级，作为根菜单
        rootMenus.push(menuMap.get(page.id))
      } else {
        // 有父级，添加到父菜单的 children
        const parent = menuMap.get(page.parent_id)
        if (parent) {
          parent.children.push(menuMap.get(page.id))
        }
      }
    })
    
    menuList.value = rootMenus
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    menuList.value = []
  }
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

onMounted(() => {
  loadMenuList()
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #fff;
  transition: width 0.3s;
  overflow: hidden;
  border-right: 1px solid #e4e7ed;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
}

.logo h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.sidebar-menu {
  border: none;
  background-color: #fff;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 隐藏侧边栏滚动条 */
.sidebar-menu::-webkit-scrollbar {
  display: none;
}

.sidebar-menu {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

:deep(.el-menu-item) {
  color: #606266;
  margin: 4px 8px;
  border-radius: 6px;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
  color: #409eff;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 500;
  border-left: 3px solid #409eff;
}

:deep(.el-sub-menu__title) {
  color: #606266;
  margin: 4px 8px;
  border-radius: 6px;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa;
  color: #409eff;
}

:deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  color: #409eff;
}

/* 当子菜单项被激活时，父菜单也显示激活样式 */
:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  background-color: #ecf5ff !important;
  color: #409eff !important;
  font-weight: 500;
}

:deep(.el-sub-menu .el-menu-item) {
  margin: 4px 8px 4px 16px;
  border-radius: 6px;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 500;
  border-left: 3px solid #409eff;
}

/* 子菜单背景 */
:deep(.el-menu--inline) {
  background-color: #fafafa;
}

/* 图标颜色继承 */
:deep(.el-icon) {
  color: inherit;
}

/* 菜单项图标与文字间距 */
:deep(.el-menu-item .el-icon) {
  margin-right: 8px;
}

:deep(.el-sub-menu__title .el-icon) {
  margin-right: 8px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}

.collapse-icon:hover {
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>

