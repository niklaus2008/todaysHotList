# 部署指南

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 6+
- Git

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd todaysHotList
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：
```env
PORT=3002
GITHUB_TOKEN=your_github_personal_access_token
CACHE_TTL=300000
```

### 4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 📦 Docker 部署

### 使用 Docker Compose（推荐）
```bash
# 创建环境变量文件
echo "GITHUB_TOKEN=your_github_token" > .env

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f todays-hotlist
```

### 手动构建 Docker 镜像
```bash
# 构建镜像
docker build -t todays-hotlist .

# 运行容器
docker run -d \
  -p 3002:3002 \
  -e GITHUB_TOKEN=your_github_token \
  --name todays-hotlist \
  todays-hotlist
```

## ☁️ 云平台部署

### Vercel 部署
1. 连接你的GitHub仓库到Vercel
2. 配置环境变量：
   - `GITHUB_TOKEN`: 你的GitHub token
3. 部署自动进行

### Heroku 部署
```bash
# 登录Heroku
heroku login

# 创建应用
heroku create your-app-name

# 设置环境变量
heroku config:set GITHUB_TOKEN=your_github_token

# 部署
git push heroku main
```

### Railway 部署
1. 连接GitHub仓库
2. 在Railway仪表板中设置环境变量
3. 自动部署

## 🔧 环境变量说明

| 变量名 | 必填 | 默认值 | 说明 |
|--------|------|--------|------|
| `PORT` | 否 | 3002 | 服务监听端口 |
| `GITHUB_TOKEN` | 否 | - | GitHub个人访问令牌 |
| `CACHE_TTL` | 否 | 300000 | 缓存时间(毫秒) |
| `NODE_ENV` | 否 | development | 运行环境 |

## 📊 监控和日志

### 健康检查
```bash
curl http://localhost:3002/health
```

### 系统信息
```bash
curl http://localhost:3002/system/info
```

### 速率限制状态
```bash
curl http://localhost:3002/api/github/rate-limit
```

## 🔐 安全配置

### GitHub Token 获取
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 选择权限：`public_repo` (只读权限)
4. 生成并复制token

### 防火墙配置
- 开放端口：3002 (HTTP)
- 限制访问IP（生产环境）
- 启用HTTPS（生产环境）

## 📈 性能优化

### 缓存配置
- 内存缓存：默认5分钟
- 可配置Redis缓存（需要修改代码）
- 前端本地存储：5分钟

### CDN 配置
```nginx
# Nginx配置示例
location / {
    proxy_pass http://localhost:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache my_cache;
    proxy_cache_valid 200 5m;
}
```

## 🐛 故障排除

### 常见问题

1. **端口占用**
   ```bash
   lsof -i :3002
   kill -9 <PID>
   ```

2. **权限错误**
   ```bash
   chmod +x scripts/*.sh
   ```

3. **依赖问题**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 日志查看
```bash
# Docker容器日志
docker logs todays-hotlist

# 系统日志
journalctl -u todays-hotlist.service

# 实时日志
tail -f logs/app.log
```

## 🔄 更新部署

### 常规更新
```bash
git pull origin main
npm install
npm run build
pm2 restart all
```

### Docker更新
```bash
docker-compose pull
docker-compose up -d
```

## 📝 版本回滚

### 使用Git回滚
```bash
git checkout <previous-commit-hash>
npm install
npm start
```

### Docker回滚
```bash
docker run -d \
  -p 3002:3002 \
  -e GITHUB_TOKEN=your_token \
  --name todays-hotlist-old \
  todays-hotlist:previous-version
```

## 🆘 紧急情况

### 服务宕机
1. 检查日志：`docker logs todays-hotlist`
2. 重启服务：`docker-compose restart`
3. 回滚版本（如果需要）

### 数据库问题
1. 备份数据
2. 检查连接字符串
3. 重启数据库服务

---

**注意**: 生产环境部署前请确保进行充分的测试和安全审查。