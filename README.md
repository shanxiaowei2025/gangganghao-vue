# 钢钢好管理系统

基于 Vue 3 + Element Plus + Vite 的现代化管理系统前端项目

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 状态管理
- **Element Plus** - UI 组件库
- **Axios** - HTTP 客户端
- **Vite** - 下一代前端构建工具

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm / npm / yarn

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 配置环境变量

复制 `.env.template` 文件为 `.env` 并修改配置：

```bash
cp .env.template .env
```

编辑 `.env` 文件，设置后端 API 地址：

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

构建产物将生成在 `dist` 目录。

## 项目结构

```
gangganghao-vue/
├── src/
│   ├── api/              # API 接口
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── config/           # 配置文件
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── .env.template         # 环境变量模板
├── nginx.conf            # Nginx 配置
├── docker-compose.yml    # Docker Compose 配置
├── Dockerfile            # Docker 配置
└── vite.config.js        # Vite 配置
```

## 部署

### Docker 部署（推荐）

使用 Docker Compose 一键部署：

```bash
docker-compose up -d
```

### 传统部署

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

## 功能模块

- ✅ 用户认证与授权
- ✅ 用户管理
- ✅ 角色管理
- ✅ 部门管理
- ✅ 权限管理
- ✅ 仓储管理
- ✅ 订单管理
- ✅ 生产管理
- ✅ 材料管理
- ✅ 质量管理
- ✅ 出库管理
- ✅ 配送管理
- ✅ 结算管理
- ✅ 财务统计
- ✅ 设备管理

## 开发说明

### API 配置

后端 API 地址在 `src/config/index.js` 中配置，通过环境变量 `VITE_API_BASE_URL` 设置。

### 路由配置

路由配置在 `src/router/index.js`，已实现路由守卫进行权限验证。

### 状态管理

使用 Pinia 进行状态管理，可在 `src/stores/` 目录添加 store 模块。

## License

MIT

