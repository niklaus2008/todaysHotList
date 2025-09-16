const Joi = require('joi');

// 配置验证schema
const configSchema = Joi.object({
    port: Joi.number().port().default(3002),
    githubToken: Joi.string().optional(),
    cacheTTL: Joi.number().min(0).default(300000),
    rateLimitWindow: Joi.number().min(1000).default(60000),
    rateLimitMaxGlobal: Joi.number().min(1).default(100),
    rateLimitMaxGitHub: Joi.number().min(1).default(30),
    apiTimeout: Joi.number().min(1000).default(10000),
    fetchTimeout: Joi.number().min(1000).default(8000),
    nodeEnv: Joi.string().valid('development', 'production', 'test').default('development')
});

// 获取配置
const getConfig = () => {
    const config = {
        port: parseInt(process.env.PORT) || 3002,
        githubToken: process.env.GITHUB_TOKEN,
        cacheTTL: parseInt(process.env.CACHE_TTL) || 300000,
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
        rateLimitMaxGlobal: parseInt(process.env.RATE_LIMIT_MAX_GLOBAL) || 100,
        rateLimitMaxGitHub: parseInt(process.env.RATE_LIMIT_MAX_GITHUB) || 30,
        apiTimeout: parseInt(process.env.API_TIMEOUT) || 10000,
        fetchTimeout: parseInt(process.env.FETCH_TIMEOUT) || 8000,
        nodeEnv: process.env.NODE_ENV || 'development'
    };

    // 验证配置
    const { error, value } = configSchema.validate(config);
    
    if (error) {
        throw new Error(`配置验证失败: ${error.message}`);
    }

    return value;
};

// 检查必需的环境变量
const validateEnvironment = () => {
    const required = ['PORT'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.warn(`⚠️  警告: 以下环境变量未设置: ${missing.join(', ')}`);
    }

    if (!process.env.GITHUB_TOKEN) {
        console.warn('⚠️  警告: GITHUB_TOKEN未设置，API调用将受到速率限制');
    }
};

module.exports = {
    getConfig,
    validateEnvironment,
    configSchema
};