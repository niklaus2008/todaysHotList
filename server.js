const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 导入GitHub API路由
const githubRoutes = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GitHub API路由
app.use('/api/github', githubRoutes);

// 根路径 - 重定向到首页
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// 健康检查接口
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'GitHub API Proxy',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 代理服务器运行在 http://localhost:${PORT}`);
    console.log(`⭐  GitHub热门仓库: http://localhost:${PORT}/api/github/repositories`);
    console.log(`👤  GitHub用户仓库: http://localhost:${PORT}/api/github/users/:username/repositories`);
    console.log(`📋  GitHub仓库详情: http://localhost:${PORT}/api/github/repositories/:owner/:repo`);
    console.log(`❤️  健康检查接口: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    process.exit(0);
});

module.exports = app;