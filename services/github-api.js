const fetch = require('node-fetch');

class GitHubAPI {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.defaultHeaders = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'todays-hotlist-proxy/1.0.0'
    };
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
      const query = `stars:>${minStars}`;
      const url = `${this.baseURL}/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&sort=stars&order=desc`;
      
      const response = await fetch(url, {
        headers: this.defaultHeaders
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
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
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
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
      const url = `${this.baseURL}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`;
      
      const response = await fetch(url, {
        headers: this.defaultHeaders
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
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
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
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
      const url = `${this.baseURL}/repos/${owner}/${repo}`;
      
      const response = await fetch(url, {
        headers: this.defaultHeaders
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
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
          watchers: data.watchers_count
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取GitHub API速率限制状态
   * @returns {Promise<Object>} 速率限制信息
   */
  async getRateLimit() {
    try {
      const url = `${this.baseURL}/rate_limit`;
      
      const response = await fetch(url, {
        headers: this.defaultHeaders
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        rateLimit: data.rate,
        resources: data.resources
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = GitHubAPI;