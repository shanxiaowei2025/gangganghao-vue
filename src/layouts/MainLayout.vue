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
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        <el-menu-item index="/warehouse">
          <el-icon><Box /></el-icon>
          <template #title>仓储管理</template>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><Document /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>
        <el-menu-item index="/production">
          <el-icon><Tools /></el-icon>
          <template #title>生产管理</template>
        </el-menu-item>
        <el-menu-item index="/materials">
          <el-icon><Files /></el-icon>
          <template #title>材料管理</template>
        </el-menu-item>
        <el-menu-item index="/quality">
          <el-icon><Checked /></el-icon>
          <template #title>质量管理</template>
        </el-menu-item>
        <el-menu-item index="/outbound">
          <el-icon><Upload /></el-icon>
          <template #title>出库管理</template>
        </el-menu-item>
        <el-menu-item index="/delivery">
          <el-icon><Van /></el-icon>
          <template #title>配送管理</template>
        </el-menu-item>
        <el-menu-item index="/settlement">
          <el-icon><Money /></el-icon>
          <template #title>结算管理</template>
        </el-menu-item>
        <el-menu-item index="/finance">
          <el-icon><DataLine /></el-icon>
          <template #title>财务统计</template>
        </el-menu-item>
        <el-menu-item index="/admin-center">
          <el-icon><Management /></el-icon>
          <template #title>管理中心</template>
        </el-menu-item>
        <el-sub-menu 
          index="system-settings"
          :class="{ 'is-active': isSystemSettingsActive }"
        >
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/roles">
            <el-icon><UserFilled /></el-icon>
            <template #title>角色管理</template>
          </el-menu-item>
          <el-menu-item index="/departments">
            <el-icon><OfficeBuilding /></el-icon>
            <template #title>部门管理</template>
          </el-menu-item>
          <el-menu-item index="/permission">
            <el-icon><Key /></el-icon>
            <template #title>权限管理</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/devices">
          <el-icon><Monitor /></el-icon>
          <template #title>设备管理</template>
        </el-menu-item>
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
import { ref, computed } from 'vue'
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

const route = useRoute()
const isCollapse = ref(false)

const activeMenu = computed(() => {
  return route.path
})

// 检测系统设置子菜单是否激活
const isSystemSettingsActive = computed(() => {
  const systemSettingsRoutes = ['/users', '/roles', '/departments', '/permission']
  return systemSettingsRoutes.includes(route.path)
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
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

