const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // GitHub API 错误
    if (err.message.includes('GitHub API error')) {
        return res.status(502).json({
            success: false,
            error: 'GitHub API服务暂时不可用',
            code: 'GITHUB_API_ERROR'
        });
    }

    // 网络错误
    if (err.message.includes('fetch') || err.message.includes('network')) {
        return res.status(503).json({
            success: false,
            error: '网络连接问题，请稍后重试',
            code: 'NETWORK_ERROR'
        });
    }

    // 验证错误
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: err.message,
            code: 'VALIDATION_ERROR'
        });
    }

    // 默认服务器错误
    res.status(500).json({
        success: false,
        error: '服务器内部错误',
        code: 'INTERNAL_ERROR'
    });
};

module.exports = errorHandler;