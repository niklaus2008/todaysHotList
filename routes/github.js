const express = require('express');
const GitHubAPI = require('../services/github-api');
const router = express.Router();

const github = new GitHubAPI();

/**
 * @route GET /api/github/repositories
 * @desc 获取热门GitHub仓库
 * @query {number} minStars - 最小star数 (默认: 1000)
 * @query {number} perPage - 每页数量 (默认: 10)
 * @query {number} page - 页码 (默认: 1)
 */
router.get('/repositories', async (req, res) => {
  try {
    const minStars = parseInt(req.query.minStars) || 1000;
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    // 验证参数
    if (minStars < 0) {
      return res.status(400).json({
        success: false,
        error: 'minStars必须大于等于0'
      });
    }

    if (perPage < 1 || perPage > 100) {
      return res.status(400).json({
        success: false,
        error: 'perPage必须在1-100之间'
      });
    }

    if (page < 1) {
      return res.status(400).json({
        success: false,
        error: 'page必须大于等于1'
      });
    }

    const result = await github.searchRepositoriesByStars(minStars, perPage, page);

    if (result.success) {
      res.json({
        success: true,
        data: result.items,
        pagination: result.pagination,
        totalCount: result.totalCount
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '服务器内部错误: ' + error.message
    });
  }
});

/**
 * @route GET /api/github/repositories/:owner/:repo
 * @desc 获取特定仓库详情
 */
router.get('/repositories/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const result = await github.getRepository(owner, repo);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '服务器内部错误: ' + error.message
    });
  }
});

/**
 * @route GET /api/github/users/:username/repositories
 * @desc 获取用户仓库列表
 * @query {number} perPage - 每页数量 (默认: 10)
 * @query {number} page - 页码 (默认: 1)
 */
router.get('/users/:username/repositories', async (req, res) => {
  try {
    const { username } = req.params;
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    if (perPage < 1 || perPage > 100) {
      return res.status(400).json({
        success: false,
        error: 'perPage必须在1-100之间'
      });
    }

    const result = await github.getUserRepositories(username, perPage, page);

    if (result.success) {
      res.json({
        success: true,
        data: result.items,
        pagination: result.pagination
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '服务器内部错误: ' + error.message
    });
  }
});

/**
 * @route GET /api/github/rate-limit
 * @desc 获取API速率限制信息
 */
router.get('/rate-limit', async (req, res) => {
  try {
    const result = await github.getRateLimit();

    if (result.success) {
      res.json({
        success: true,
        data: result.rateLimit,
        resources: result.resources
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '服务器内部错误: ' + error.message
    });
  }
});

module.exports = router;