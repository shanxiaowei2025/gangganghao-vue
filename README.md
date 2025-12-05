# 管理系统前端项目

基于 Vue 3 + Element Plus 的管理系统前端项目

## 技术栈

- Vue 3
- Vue Router 4
- Element Plus
- Vite
- Pinia

## 项目结构

```
guanlixitong-vue/
├── src/
│   ├── assets/          # 静态资源
│   │   └── styles/      # 样式文件
│   ├── components/      # 公共组件
│   │   └── UserAvatar.vue  # 用户头像组件
│   ├── layouts/         # 布局组件
│   │   └── MainLayout.vue  # 主布局
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── views/           # 页面组件
│   │   ├── Login.vue    # 登录页
│   │   └── Dashboard.vue # 仪表盘
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── index.html
├── package.json
└── vite.config.js
```

## 安装依赖

```bash
npm install
```

## 启动开发服务器

```bash
npm run dev
```

## 构建生产版本

```bash
npm run build
```

## 功能说明

### 已实现功能

1. **登录页面**
   - 用户名密码登录
   - 表单验证
   - 使用虚拟数据进行登录（后续可对接真实接口）

2. **主布局**
   - 左侧导航栏（可折叠）
   - 顶部导航栏
   - 右上角用户头像下拉菜单

3. **用户功能**
   - 显示当前登录用户信息
   - 修改个人资料
   - 退出登录

4. **仪表盘**
   - 统计数据展示
   - 最近活动时间线
   - 系统信息展示

### 后续对接接口说明

项目中使用虚拟数据，后续需要对接后端接口时，请修改以下文件：

1. **登录接口** - `src/views/Login.vue`
   - 替换 `handleLogin` 方法中的模拟登录逻辑

2. **用户信息接口** - `src/components/UserAvatar.vue`
   - 替换 `loadUserInfo` 方法中的本地存储读取
   - 替换 `handleSaveProfile` 方法中的保存逻辑

3. **路由守卫** - `src/router/index.js`
   - 根据实际需求调整 token 验证逻辑

## 默认登录信息

当前使用虚拟数据，任意用户名和密码（密码长度≥6）都可以登录。

