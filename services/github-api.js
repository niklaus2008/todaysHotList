const fetch = require('node-fetch');
const cache = require('../utils/cache');
const Validation = require('../utils/validation');

class GitHubAPI {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.defaultHeaders = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'todays-hotlist-proxy/1.0.0'
    };
    
    // 添加认证头（如果提供了GITHUB_TOKEN）
    if (process.env.GITHUB_TOKEN) {
      this.defaultHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
  }

  /**
   * 搜索star数超过指定数量的仓库
   * @param {number} minStars - 最小star数
   * @param {number} perPage - 每页数量
   * @param {number} page - 页码
   * @returns {Promise<Object>} 搜索结果
   */
  async searchRepositoriesByStars(minStars = 1000, perPage = 10, page = 1) {
    try {
      // 参数验证
      const validatedParams = Validation.validateSearchParams(minStars, perPage, page);
      minStars = validatedParams.minStars;
      perPage = validatedParams.perPage;
      page = validatedParams.page;

      const query = `stars:>${minStars}`;
      const cacheKey = `search:${query}:${perPage}:${page}`;
      
      // 检查缓存
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const url = `${this.baseURL}/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&sort=stars&order=desc`;
      
      const response = await fetch(url, {
        headers: this.defaultHeaders,
        timeout: 10000 // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 检查API限制
      const rateLimit = response.headers.get('x-ratelimit-remaining');
      if (rateLimit && parseInt(rateLimit) < 10) {
        console.warn(`⚠️ GitHub API速率限制警告: 剩余 ${rateLimit} 次请求`);
      }

      const result = {
        success: true,
        totalCount: data.total_count,
        items: data.items.map(item => ({
          id: item.id,
          name: item.name,
          fullName: item.full_name,
          description: item.description,
          stars: item.stargazers_count,
          forks: item.forks_count,
          language: item.language,
          url: item.html_url,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })),
        pagination: {
          perPage,
          page,
          totalPages: Math.ceil(data.total_count / perPage)
        },
        cached: false
      };

      // 缓存结果（5分钟）
      cache.set(cacheKey, result, 300000);
      
      return result;
    } catch (error) {
      console.error('GitHub搜索错误:', error.message);
      return {
        success: false,
        error: `GitHub API错误: ${error.message}`,
        items: []
      };
    }
  }

  /**
   * 获取指定用户的仓库列表
   * @param {string} username - GitHub用户名
   * @param {number} perPage - 每页数量
   * @param {number} page - 页码
   * @returns {Promise<Object>} 用户仓库列表
   */
  async getUserRepositories(username, perPage = 10, page = 1) {
    try {
      // 参数验证
      const validatedUsername = Validation.validateGitHubUsername(username);
      const validatedPagination = Validation.validatePagination(page, perPage);
      username = validatedUsername;
      perPage = validatedPagination.perPage;
      page = validatedPagination.page;

      const cacheKey = `user:${username}:${perPage}:${page}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const url = `${this.baseURL}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`;
      
      const response = await fetch(url, {
        headers: this.defaultHeaders,
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const result = {
        success: true,
        items: data.map(repo => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          url: repo.html_url,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at
        })),
        pagination: {
          perPage,
          page
        },
        cached: false
      };

      cache.set(cacheKey, result, 300000);
      
      return result;
    } catch (error) {
      console.error('获取用户仓库错误:', error.message);
      return {
        success: false,
        error: `GitHub API错误: ${error.message}`,
        items: []
      };
    }
  }

  /**
   * 获取仓库详情
   * @param {string} owner - 仓库所有者
   * @param {string} repo - 仓库名称
   * @returns {Promise<Object>} 仓库详情
   */
  async getRepository(owner, repo) {
    try {
      // 参数验证
      const validatedOwner = Validation.validateGitHubUsername(owner);
      const validatedRepo = Validation.validateRepoName(repo);
      owner = validatedOwner;
      repo = validatedRepo;

      const cacheKey = `repo:${owner}:${repo}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const url = `${this.baseURL}/repos/${owner}/${repo}`;
      
      const response = await fetch(url, {
        headers: this.defaultHeaders,
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const result = {
        success: true,
        data: {
          id: data.id,
          name: data.name,
          fullName: data.full_name,
          description: data.description,
          stars: data.stargazers_count,
          forks: data.forks_count,
          language: data.language,
          url: data.html_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          license: data.license?.name,
          topics: data.topics || [],
          openIssues: data.open_issues_count,
          watchers: data.watchers_count,
          defaultBranch: data.default_branch,
          size: data.size,
          archived: data.archived,
          disabled: data.disabled
        },
        cached: false
      };

      cache.set(cacheKey, result, 300000);
      
      return result;
    } catch (error) {
      console.error('获取仓库详情错误:', error.message);
      return {
        success: false,
        error: `GitHub API错误: ${error.message}`
      };
    }
  }

  /**
   * 获取GitHub API速率限制状态
   * @returns {Promise<Object>} 速率限制信息
   */
  async getRateLimit() {
    try {
      const cacheKey = 'rate_limit';
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const url = `${this.baseURL}/rate_limit`;
      
      const response = await fetch(url, {
        headers: this.defaultHeaders,
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const result = {
        success: true,
        rateLimit: data.rate,
        resources: data.resources,
        cached: false
      };

      // 速率限制信息缓存1分钟
      cache.set(cacheKey, result, 60000);
      
      return result;
    } catch (error) {
      console.error('获取速率限制错误:', error.message);
      return {
        success: false,
        error: `GitHub API错误: ${error.message}`
      };
    }
  }
}

module.exports = GitHubAPI;