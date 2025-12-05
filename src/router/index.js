import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import UserManage from '@/views/UserManage.vue'
import WarehouseManage from '@/views/WarehouseManage.vue'
import OrderManage from '@/views/OrderManage.vue'
import ProductionManage from '@/views/ProductionManage.vue'
import MaterialManage from '@/views/MaterialManage.vue'
import QualityManage from '@/views/QualityManage.vue'
import OutboundManage from '@/views/OutboundManage.vue'
import DeliveryManage from '@/views/DeliveryManage.vue'
import SettlementManage from '@/views/SettlementManage.vue'
import FinanceStats from '@/views/FinanceStats.vue'
import AdminCenter from '@/views/AdminCenter.vue'
import SystemSettings from '@/views/SystemSettings.vue'
import DeviceManage from '@/views/DeviceManage.vue'
import config from '@/config'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '仪表盘' }
      },
      {
        path: '/users',
        name: 'UserManage',
        component: UserManage,
        meta: { title: '用户管理' }
      },
      {
        path: '/roles',
        name: 'RoleManage',
        component: () => import('@/views/RoleManage.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: '/departments',
        name: 'DepartmentManage',
        component: () => import('@/views/DepartmentManage.vue'),
        meta: { title: '部门管理' }
      },
      {
        path: '/permission',
        name: 'PermissionSettings',
        component: () => import('@/views/PermissionSettings.vue'),
        meta: { title: '权限管理' }
      },
      {
        path: '/warehouse',
        name: 'WarehouseManage',
        component: WarehouseManage,
        meta: { title: '仓储管理' }
      },
      {
        path: '/orders',
        name: 'OrderManage',
        component: OrderManage,
        meta: { title: '订单管理' }
      },
      {
        path: '/production',
        name: 'ProductionManage',
        component: ProductionManage,
        meta: { title: '生产管理' }
      },
      {
        path: '/materials',
        name: 'MaterialManage',
        component: MaterialManage,
        meta: { title: '材料管理' }
      },
      {
        path: '/quality',
        name: 'QualityManage',
        component: QualityManage,
        meta: { title: '质量管理' }
      },
      {
        path: '/outbound',
        name: 'OutboundManage',
        component: OutboundManage,
        meta: { title: '出库管理' }
      },
      {
        path: '/delivery',
        name: 'DeliveryManage',
        component: DeliveryManage,
        meta: { title: '配送管理' }
      },
      {
        path: '/settlement',
        name: 'SettlementManage',
        component: SettlementManage,
        meta: { title: '结算管理' }
      },
      {
        path: '/finance',
        name: 'FinanceStats',
        component: FinanceStats,
        meta: { title: '财务统计' }
      },
      {
        path: '/admin-center',
        name: 'AdminCenter',
        component: AdminCenter,
        meta: { title: '管理中心' }
      },
      {
        path: '/system-settings',
        name: 'SystemSettings',
        component: SystemSettings,
        meta: { title: '系统设置' }
      },
      {
        path: '/devices',
        name: 'DeviceManage',
        component: DeviceManage,
        meta: { title: '设备管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem(config.tokenKey)
  
  if (to.path === '/login') {
    // 如果已登录，跳转到首页
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    // 如果未登录，跳转到登录页
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router

