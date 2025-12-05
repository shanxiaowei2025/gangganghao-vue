# 部署指南

本文档提供了多种部署方式，请根据实际需求选择合适的方式。

## 目录

- [环境要求](#环境要求)
- [部署前准备](#部署前准备)
- [传统服务器部署](#传统服务器部署)
- [Docker 部署](#docker-部署)
- [常见问题](#常见问题)

## 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- Nginx (传统部署方式)
- Docker & Docker Compose (容器化部署方式)

## 部署前准备

### 1. 配置环境变量

复制环境变量示例文件并根据实际情况修改：

```bash
cp .env.example .env.production
```

编辑 `.env.production` 文件，配置后端API地址：

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 2. 构建项目

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，会在项目根目录生成 `dist` 文件夹。

## 传统服务器部署

### 方式一：使用部署脚本（推荐）

项目提供了自动化部署脚本 `deploy.sh`。

**步骤：**

1. 上传项目到服务器
2. 赋予脚本执行权限
3. 运行部署脚本

```bash
# 上传项目到服务器
scp -r ./gangganghao-vue user@your-server:/path/to/

# SSH 登录服务器
ssh user@your-server

# 进入项目目录
cd /path/to/gangganghao-vue

# 赋予脚本执行权限
chmod +x deploy.sh

# 运行部署脚本（需要 root 权限）
sudo ./deploy.sh
```

### 方式二：手动部署

#### 1. 上传构建产物

将 `dist` 文件夹上传到服务器：

```bash
scp -r dist/* user@your-server:/var/www/gangganghao-vue/
```

#### 2. 配置 Nginx

将 `nginx.conf` 复制到 Nginx 配置目录：

```bash
sudo cp nginx.conf /etc/nginx/sites-available/gangganghao-vue
sudo ln -s /etc/nginx/sites-available/gangganghao-vue /etc/nginx/sites-enabled/
```

编辑配置文件，修改以下内容：
- `server_name`: 修改为你的域名
- `root`: 修改为实际的项目路径
- `proxy_pass`: 修改为实际的后端服务地址

#### 3. 测试并重载 Nginx

```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

#### 4. 设置文件权限

```bash
sudo chown -R www-data:www-data /var/www/gangganghao-vue
sudo chmod -R 755 /var/www/gangganghao-vue
```

## Docker 部署

### 方式一：使用 Docker Compose（推荐）

最简单的方式，一键部署：

```bash
# 构建并启动容器
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f frontend
```

停止服务：

```bash
docker-compose down
```

### 方式二：使用 Docker 命令

```bash
# 构建镜像
docker build -t gangganghao-frontend:latest .

# 运行容器
docker run -d \
  --name gangganghao-frontend \
  -p 80:80 \
  --restart unless-stopped \
  gangganghao-frontend:latest

# 查看容器状态
docker ps

# 查看日志
docker logs -f gangganghao-frontend
```

### Docker 部署的优势

- ✅ 环境一致性：开发和生产环境完全一致
- ✅ 快速部署：一键启动，无需配置环境
- ✅ 易于维护：容器化管理，方便升级和回滚
- ✅ 资源隔离：不影响服务器其他服务

## 常见问题

### 1. 构建失败

**问题**：`npm run build` 时出现错误

**解决方案**：
- 检查 Node.js 版本是否符合要求 (>= 16.0.0)
- 删除 `node_modules` 和 `package-lock.json`，重新安装依赖
- 检查环境变量配置是否正确

### 2. 页面刷新 404

**问题**：SPA 应用在刷新页面时返回 404

**解决方案**：
- 检查 Nginx 配置中是否包含 `try_files $uri $uri/ /index.html;`
- 确保配置已经生效：`sudo nginx -t && sudo systemctl reload nginx`

### 3. API 请求失败

**问题**：前端无法连接后端 API

**解决方案**：
- 检查 `.env.production` 中的 `VITE_API_BASE_URL` 是否正确
- 检查后端服务是否正常运行
- 检查防火墙和安全组规则
- 检查 Nginx 代理配置（如果使用代理）

### 4. 静态资源加载失败

**问题**：CSS、JS 文件加载 404

**解决方案**：
- 检查文件权限：`sudo chmod -R 755 /var/www/gangganghao-vue`
- 检查 Nginx 配置中的 `root` 路径是否正确
- 检查构建产物是否完整

### 5. Docker 容器无法启动

**问题**：Docker 容器启动失败

**解决方案**：
- 查看容器日志：`docker logs gangganghao-frontend`
- 检查端口是否被占用：`netstat -tulpn | grep :80`
- 确保 Docker 和 Docker Compose 版本符合要求

## 性能优化建议

### 1. 启用 Gzip 压缩

Nginx 配置文件中已包含 Gzip 配置，确保已启用。

### 2. 设置静态资源缓存

配置文件中已设置静态资源 7 天缓存，可根据需求调整。

### 3. 使用 CDN

将静态资源上传到 CDN，可以大幅提升加载速度。

### 4. 启用 HTTP/2

如果使用 HTTPS，建议启用 HTTP/2：

```nginx
listen 443 ssl http2;
```

## 安全建议

### 1. 使用 HTTPS

建议使用 Let's Encrypt 免费证书：

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 2. 隐藏 Nginx 版本

在 Nginx 配置中添加：

```nginx
server_tokens off;
```

### 3. 防止点击劫持

添加 HTTP 安全头：

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## 监控和日志

### 查看访问日志

```bash
tail -f /var/log/nginx/gangganghao-vue-access.log
```

### 查看错误日志

```bash
tail -f /var/log/nginx/gangganghao-vue-error.log
```

### Docker 日志

```bash
docker logs -f gangganghao-frontend
```

## 更新部署

### 传统部署更新

```bash
# 1. 拉取最新代码
git pull

# 2. 安装依赖
npm install

# 3. 构建
npm run build

# 4. 运行部署脚本
sudo ./deploy.sh
```

### Docker 部署更新

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建并启动
docker-compose up -d --build

# 或使用 Docker 命令
docker build -t gangganghao-frontend:latest .
docker stop gangganghao-frontend
docker rm gangganghao-frontend
docker run -d --name gangganghao-frontend -p 80:80 gangganghao-frontend:latest
```

## 回滚

### 传统部署回滚

备份文件位于 `/var/www/backups/gangganghao-vue/`，可以手动恢复：

```bash
cd /var/www/gangganghao-vue
tar -xzf /var/www/backups/gangganghao-vue/dist_backup_YYYYMMDD_HHMMSS.tar.gz
```

### Docker 部署回滚

```bash
# 使用之前的镜像版本
docker run -d --name gangganghao-frontend -p 80:80 gangganghao-frontend:previous-tag
```

## 技术支持

如有问题，请查看项目文档或提交 Issue。
