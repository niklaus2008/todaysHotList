const rateLimit = require('express-rate-limit');

// 全局速率限制：每个IP每分钟100次请求
const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1分钟
    max: 100,
    message: {
        success: false,
        error: '请求过于频繁，请稍后再试',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// GitHub API端点专用限制：每个IP每分钟30次请求
const githubAPILimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        success: false,
        error: 'GitHub API请求过于频繁，请稍后再试',
        code: 'GITHUB_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    globalLimiter,
    githubAPILimiter
};