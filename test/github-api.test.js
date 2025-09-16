const GitHubAPI = require('../services/github-api');

describe('GitHub API Service', () => {
  let githubAPI;

  beforeEach(() => {
    githubAPI = new GitHubAPI();
  });

  describe('searchRepositoriesByStars', () => {
    it('should search repositories with minimum stars', async () => {
      const result = await githubAPI.searchRepositoriesByStars(1000, 5, 1);
      
      expect(result.success).toBe(true);
      expect(result.totalCount).toBeGreaterThan(0);
      expect(result.items).toHaveLength(5);
      
      // 验证返回的数据结构
      const repo = result.items[0];
      expect(repo).toHaveProperty('id');
      expect(repo).toHaveProperty('name');
      expect(repo).toHaveProperty('fullName');
      expect(repo).toHaveProperty('stars');
      expect(repo.stars).toBeGreaterThanOrEqual(1000);
      expect(repo).toHaveProperty('language');
      expect(repo).toHaveProperty('url');
    });

    it('should handle API errors gracefully', async () => {
      // 测试无效参数的情况
      const result = await githubAPI.searchRepositoriesByStars(-100, 5, 1);
      
      // GitHub API 应该仍然返回成功，但可能没有结果
      expect(result.success).toBe(true);
      expect(result.items).toBeDefined();
    });
  });

  describe('getUserRepositories', () => {
    it('should get repositories for a valid user', async () => {
      const result = await githubAPI.getUserRepositories('facebook', 3, 1);
      
      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(3);
      
      const repo = result.items[0];
      expect(repo).toHaveProperty('name');
      expect(repo).toHaveProperty('fullName');
      expect(repo.fullName).toContain('facebook/');
      expect(repo).toHaveProperty('stars');
      expect(repo).toHaveProperty('forks');
    });

    it('should handle non-existent users', async () => {
      const result = await githubAPI.getUserRepositories('nonexistentuser123456789', 5, 1);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('404');
    });
  });

  describe('getRepository', () => {
    it('should get repository details for a valid repo', async () => {
      const result = await githubAPI.getRepository('facebook', 'react');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe('react');
      expect(result.data.fullName).toBe('facebook/react');
      expect(result.data.stars).toBeGreaterThan(100000);
      expect(result.data.language).toBe('JavaScript');
    });

    it('should handle non-existent repositories', async () => {
      const result = await githubAPI.getRepository('facebook', 'nonexistent-repo-123456');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('404');
    });
  });

  describe('getRateLimit', () => {
    it('should get rate limit information', async () => {
      const result = await githubAPI.getRateLimit();
      
      expect(result.success).toBe(true);
      expect(result.rateLimit).toBeDefined();
      expect(result.rateLimit).toHaveProperty('limit');
      expect(result.rateLimit).toHaveProperty('remaining');
      expect(result.rateLimit).toHaveProperty('reset');
      expect(result.rateLimit.limit).toBeGreaterThan(0);
    });
  });

  describe('API integration tests', () => {
    it('should return consistent data across different methods', async () => {
      // 先搜索react相关的仓库
      const searchResult = await githubAPI.searchRepositoriesByStars(100000, 10, 1);
      expect(searchResult.success).toBe(true);
      
      // 从搜索结果中取一个仓库
      const reactRepo = searchResult.items.find(item => 
        item.fullName.toLowerCase().includes('react')
      );
      
      if (reactRepo) {
        // 获取该仓库的详情
        const [owner, repoName] = reactRepo.fullName.split('/');
        const detailResult = await githubAPI.getRepository(owner, repoName);
        
        expect(detailResult.success).toBe(true);
        expect(detailResult.data.fullName).toBe(reactRepo.fullName);
        expect(detailResult.data.stars).toBe(reactRepo.stars);
      }
    });

    it('should handle pagination correctly', async () => {
      const page1 = await githubAPI.searchRepositoriesByStars(1000, 5, 1);
      const page2 = await githubAPI.searchRepositoriesByStars(1000, 5, 2);
      
      expect(page1.success).toBe(true);
      expect(page2.success).toBe(true);
      
      // 确保两页的结果不同
      const page1Names = page1.items.map(item => item.fullName);
      const page2Names = page2.items.map(item => item.fullName);
      
      const commonRepos = page1Names.filter(name => page2Names.includes(name));
      expect(commonRepos).toHaveLength(0); // 不同页应该没有重复仓库
    });
  });
});