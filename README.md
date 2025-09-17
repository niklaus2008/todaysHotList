# 🔥 热门榜单聚合平台

一个基于Node.js + Express的GitHub API代理服务器，提供热门仓库搜索和用户仓库查询功能，带有美观的Web界面和AI智能提交功能。

## ✨ 功能特性

- 🔍 **智能搜索**: 按star数、编程语言筛选热门GitHub仓库
- 👤 **用户仓库**: 查询特定用户的仓库列表
- 📊 **分页浏览**: 支持分页和自定义每页数量
- 🎨 **美观界面**: 现代化UI设计，支持日间/夜间模式
- ⚡ **性能优化**: 内置缓存和速率限制机制
- 🔒 **安全可靠**: 输入验证和错误处理

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd todaysHotList
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   编辑 `.env` 文件，设置以下变量：
   ```
   PORT=3002
   GITHUB_TOKEN=your_github_token_here
   ```

4. **启动服务**
   ```bash
   # 开发模式
   npm run dev
   
   # 生产模式
   npm start
   ```

5. **访问应用**
   打开浏览器访问 `http://localhost:3002`

## 📖 API接口

### 获取热门仓库
```
GET /api/github/repositories?minStars=1000&perPage=10&page=1
```

### 获取用户仓库
```
GET /api/github/users/:username/repositories?perPage=10&page=1
```

### 获取仓库详情
```
GET /api/github/repositories/:owner/:repo
```

### 速率限制信息
```
GET /api/github/rate-limit
```

### 健康检查
```
GET /health
```

## 🛠️ 技术栈

### 后端
- **Node.js** - 运行时环境
- **Express** - Web框架
- **Joi** - 数据验证
- **express-rate-limit** - 速率限制

### 前端
- **HTML5/CSS3** - 页面结构和样式
- **JavaScript** - 交互逻辑
- **Fetch API** - 数据请求

## 📁 项目结构

```
todaysHotList/
├── config/           # 配置文件
├── middlewares/      # 中间件
├── public/          # 静态文件
│   └── index.html   # 主页面
├── routes/          # 路由
│   └── github.js    # GitHub API路由
├── services/        # 服务层
├── utils/           # 工具函数
├── server.js        # 服务器入口
└── package.json     # 项目配置
```

## ⚙️ 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3002 |
| GITHUB_TOKEN | GitHub API令牌 | - |
| CACHE_TTL | 缓存时间(毫秒) | 300000 |
| RATE_LIMIT_MAX_GLOBAL | 全局速率限制 | 100/分钟 |
| RATE_LIMIT_MAX_GITHUB | GitHub API限制 | 30/分钟 |

### GitHub Token

获取GitHub Personal Access Token：
1. 访问 https://github.com/settings/tokens
2. 生成新token，选择 `repo` 和 `user` 权限
3. 在 `.env` 文件中设置 `GITHUB_TOKEN`

## 🧪 测试

运行测试用例：
```bash
npm test
```

## 📦 部署

### Docker部署
```bash
docker-compose up -d
```

### 手动部署
1. 设置生产环境变量
2. 安装依赖：`npm install --production`
3. 启动服务：`npm start`

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🆘 常见问题

### Q: 为什么需要GitHub Token？
A: 使用token可以提高API调用限制，避免被GitHub限制访问。

### Q: 如何修改端口？
A: 在 `.env` 文件中修改 `PORT` 变量。

### Q: 如何自定义搜索条件？
A: 在前端界面中调整最小star数、每页数量和编程语言筛选。

## 📞 支持2

如有问题，请提交 [Issue](https://github.com/your-repo/issues) 或联系开发团队。