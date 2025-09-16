const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 导入配置和中间件
const { getConfig, validateEnvironment } = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const { globalLimiter, githubAPILimiter } = require('./middlewares/rateLimiter');
const githubRoutes = require('./routes/github');

// 获取配置
const config = getConfig();
validateEnvironment();

const app = express();
const PORT = config.port;

// 配置信息日志
console.log('🚀 启动配置:');
console.log(`   - 环境: ${config.nodeEnv}`);
console.log(`   - 端口: ${config.port}`);
console.log(`   - 缓存TTL: ${config.cacheTTL}ms`);
console.log(`   - API超时: ${config.apiTimeout}ms`);
console.log(`   - GitHub Token: ${config.githubToken ? '已设置' : '未设置'}`);

// 中间件
app.use(globalLimiter);
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// GitHub API路由（应用专用速率限制）
app.use('/api/github', githubAPILimiter, githubRoutes);

// 根路径 - 重定向到首页
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// 健康检查接口
app.get('/health', async (req, res) => {
    try {
        const healthInfo = {
            status: 'OK',
            service: 'GitHub API Proxy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development',
            version: require('./package.json').version
        };

        // 检查GitHub API连通性
        try {
            const githubAPI = new GitHubAPI();
            const rateLimit = await githubAPI.getRateLimit();
            healthInfo.githubAPI = {
                status: 'connected',
                rateLimit: rateLimit.rateLimit
            };
        } catch (githubError) {
            healthInfo.githubAPI = {
                status: 'disconnected',
                error: githubError.message
            };
        }

        res.json(healthInfo);
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 系统信息接口
app.get('/system/info', (req, res) => {
    res.json({
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 错误处理中间件（必须放在所有路由之后）
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 代理服务器运行在 http://localhost:${PORT}`);
    console.log(`⭐  GitHub热门仓库: http://localhost:${PORT}/api/github/repositories`);
    console.log(`👤  GitHub用户仓库: http://localhost:${PORT}/api/github/users/:username/repositories`);
    console.log(`📋  GitHub仓库详情: http://localhost:${PORT}/api/github/repositories/:owner/:repo`);
    console.log(`❤️  健康检查接口: http://localhost:${PORT}/health`);
    console.log(`📊 速率限制: 全局100次/分钟，GitHub API 30次/分钟`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    process.exit(0);
});

module.exports = app;