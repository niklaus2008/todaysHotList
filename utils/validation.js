/**
 * 参数验证工具类
 * 提供常用的参数验证函数
 */

class Validation {
    /**
     * 验证数字范围
     * @param {number} value - 要验证的值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @param {string} fieldName - 字段名称
     * @returns {number} 验证后的值
     * @throws {Error} 验证失败时抛出错误
     */
    static validateNumberRange(value, min, max, fieldName) {
        const num = Number(value);
        
        if (isNaN(num)) {
            throw new Error(`${fieldName}必须是数字`);
        }
        
        if (num < min) {
            throw new Error(`${fieldName}不能小于${min}`);
        }
        
        if (num > max) {
            throw new Error(`${fieldName}不能大于${max}`);
        }
        
        return num;
    }

    /**
     * 验证字符串非空
     * @param {string} value - 要验证的值
     * @param {string} fieldName - 字段名称
     * @returns {string} 验证后的值
     * @throws {Error} 验证失败时抛出错误
     */
    static validateNonEmptyString(value, fieldName) {
        if (!value || typeof value !== 'string') {
            throw new Error(`${fieldName}必须是字符串`);
        }
        
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error(`${fieldName}不能为空`);
        }
        
        return trimmed;
    }

    /**
     * 验证GitHub用户名格式
     * @param {string} username - GitHub用户名
     * @returns {string} 验证后的用户名
     * @throws {Error} 验证失败时抛出错误
     */
    static validateGitHubUsername(username) {
        const validated = this.validateNonEmptyString(username, 'GitHub用户名');
        
        // GitHub用户名规则：只能包含字母数字和连字符，长度1-39
        const regex = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;
        
        if (!regex.test(validated)) {
            throw new Error('GitHub用户名格式无效');
        }
        
        return validated;
    }

    /**
     * 验证仓库名称格式
     * @param {string} repoName - 仓库名称
     * @returns {string} 验证后的仓库名称
     * @throws {Error} 验证失败时抛出错误
     */
    static validateRepoName(repoName) {
        const validated = this.validateNonEmptyString(repoName, '仓库名称');
        
        // 仓库名称规则：长度1-100，可以包含字母、数字、-、_、.
        const regex = /^[a-zA-Z0-9._-]{1,100}$/;
        
        if (!regex.test(validated)) {
            throw new Error('仓库名称格式无效');
        }
        
        return validated;
    }

    /**
     * 验证分页参数
     * @param {number} page - 页码
     * @param {number} perPage - 每页数量
     * @returns {Object} 验证后的分页参数
     * @throws {Error} 验证失败时抛出错误
     */
    static validatePagination(page, perPage) {
        const validatedPage = this.validateNumberRange(page, 1, 1000, '页码');
        const validatedPerPage = this.validateNumberRange(perPage, 1, 100, '每页数量');
        
        return {
            page: validatedPage,
            perPage: validatedPerPage
        };
    }

    /**
     * 验证搜索参数
     * @param {number} minStars - 最小star数
     * @param {number} perPage - 每页数量
     * @param {number} page - 页码
     * @returns {Object} 验证后的搜索参数
     * @throws {Error} 验证失败时抛出错误
     */
    static validateSearchParams(minStars, perPage, page) {
        const validatedMinStars = this.validateNumberRange(minStars, 0, 1000000, '最小star数');
        const { page: validatedPage, perPage: validatedPerPage } = this.validatePagination(page, perPage);
        
        return {
            minStars: validatedMinStars,
            perPage: validatedPerPage,
            page: validatedPage
        };
    }

    /**
     * 验证URL参数
     * @param {string} url - URL地址
     * @param {string} fieldName - 字段名称
     * @returns {string} 验证后的URL
     * @throws {Error} 验证失败时抛出错误
     */
    static validateURL(url, fieldName = 'URL') {
        const validated = this.validateNonEmptyString(url, fieldName);
        
        try {
            new URL(validated);
            return validated;
        } catch {
            throw new Error(`${fieldName}格式无效`);
        }
    }

    /**
     * 验证电子邮件格式
     * @param {string} email - 电子邮件地址
     * @returns {string} 验证后的电子邮件
     * @throws {Error} 验证失败时抛出错误
     */
    static validateEmail(email) {
        const validated = this.validateNonEmptyString(email, '电子邮件');
        
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!regex.test(validated)) {
            throw new Error('电子邮件格式无效');
        }
        
        return validated;
    }

    /**
     * 验证对象结构
     * @param {Object} obj - 要验证的对象
     * @param {Array<string>} requiredFields - 必需字段数组
     * @throws {Error} 验证失败时抛出错误
     */
    static validateObjectStructure(obj, requiredFields) {
        if (!obj || typeof obj !== 'object') {
            throw new Error('参数必须是对象');
        }
        
        for (const field of requiredFields) {
            if (!(field in obj)) {
                throw new Error(`缺少必需字段: ${field}`);
            }
        }
    }
}

module.exports = Validation;