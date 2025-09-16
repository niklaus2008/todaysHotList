const GitHubAPI = require('../services/github-api');

async function demoGitHubAPI() {
  console.log('🚀 GitHub API 演示开始\n');
  
  const github = new GitHubAPI();

  try {
    // 1. 演示获取速率限制
    console.log('1. 📊 获取GitHub API速率限制:');
    const rateLimit = await github.getRateLimit();
    if (rateLimit.success) {
      console.log(`   剩余请求次数: ${rateLimit.rateLimit.remaining}/${rateLimit.rateLimit.limit}`);
      console.log(`   重置时间: ${new Date(rateLimit.rateLimit.reset * 1000).toLocaleString()}`);
    } else {
      console.log(`   错误: ${rateLimit.error}`);
    }
    console.log('');

    // 2. 搜索star数超过1000的仓库
    console.log('2. ⭐ 搜索star数超过1000的热门仓库 (前5个):');
    const searchResult = await github.searchRepositoriesByStars(1000, 5, 1);
    if (searchResult.success) {
      console.log(`   总共找到 ${searchResult.totalCount} 个仓库`);
      searchResult.items.forEach((repo, index) => {
        console.log(`   ${index + 1}. ${repo.fullName} - ⭐${repo.stars} - ${repo.language || '未知语言'}`);
      });
    } else {
      console.log(`   错误: ${searchResult.error}`);
    }
    console.log('');

    // 3. 获取特定仓库详情
    console.log('3. 📋 获取React仓库详情:');
    const reactRepo = await github.getRepository('facebook', 'react');
    if (reactRepo.success) {
      console.log(`   仓库: ${reactRepo.data.fullName}`);
      console.log(`   Stars: ⭐${reactRepo.data.stars}`);
      console.log(`   Forks: 🍴${reactRepo.data.forks}`);
      console.log(`   语言: ${reactRepo.data.language}`);
      console.log(`   描述: ${reactRepo.data.description}`);
    } else {
      console.log(`   错误: ${reactRepo.error}`);
    }
    console.log('');

    // 4. 获取用户仓库列表
    console.log('4. 👤 获取Microsoft的最新仓库 (前3个):');
    const userRepos = await github.getUserRepositories('microsoft', 3, 1);
    if (userRepos.success) {
      userRepos.items.forEach((repo, index) => {
        console.log(`   ${index + 1}. ${repo.name} - ⭐${repo.stars} - 更新于: ${new Date(repo.updatedAt).toLocaleDateString()}`);
      });
    } else {
      console.log(`   错误: ${userRepos.error}`);
    }

  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error.message);
  }

  console.log('\n🎉 GitHub API 演示完成');
}

// 如果直接运行此文件，则执行演示
if (require.main === module) {
  demoGitHubAPI().catch(console.error);
}

module.exports = { demoGitHubAPI };