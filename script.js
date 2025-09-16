// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const websiteSelector = document.getElementById('website-selector');
    const hotListContainer = document.getElementById('hot-list-container');
    const hotList = document.getElementById('hot-list');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    
    // 监听下拉框变化事件
    websiteSelector.addEventListener('change', function() {
        const selectedWebsite = this.value;
        if (selectedWebsite) {
            fetchHotList(selectedWebsite);
        }
    });
    
    // 获取热榜数据
    function fetchHotList(website) {
        // 显示加载动画
        showLoading();
        
        // 清空之前的列表
        hotList.innerHTML = '';
        
        // 所有网站使用模拟数据
        setTimeout(() => {
            try {
                const data = getMockData(website);
                render极客时间(data, website);
                hideLoading();
            } catch (error) {
                showError();
            }
        }, 800); // 模拟网络请求延迟
    }
    
    // 显示加载动画
    function showLoading() {
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        hotList.classList.add('hidden');
        document.querySelector('.placeholder-message').classList.add('hidden');
    }
    
    // 隐藏加载动画
    function hideLoading() {
        loadingElement.classList.add('hidden');
        hotList.classList.remove('hidden');
    }
    
    // 显示错误信息
    function showError() {
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
        hotList.classList.add('hidden');
    }
    
    // 渲染热榜列表
    function renderHotList(data, website) {
        hotList.innerHTML = '';
        
        data.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'hot-item';
            
            // 创建排名元素
            const rankSpan = document.createElement('span');
            rankSpan.className = index < 3 ? `hot-rank hot-rank-${index + 1}` : 'hot-rank';
            rankSpan.textContent = index + 1;
            
            // 创建标题链接
            const titleLink = document.createElement('a');
            titleLink.href = item.url;
            titleLink.className = 'hot-title';
            titleLink.textContent = item.title;
            titleLink.target = '_blank'; // 在新标签页打开
            
            // 创建热度指数元素
            const indexSpan = document.createElement('span');
            indexSpan.className = 'hot-index';
            indexSpan.textContent = item.index;
            
            // 将元素添加到列表项
            listItem.appendChild(rankSpan);
            listItem.appendChild(titleLink);
            listItem.appendChild(indexSpan);
            
            // 将列表项添加到热榜列表
            hotList.appendChild(listItem);
        });
    }
    


    

    

    
    // 获取模拟数据（用于其他网站或备用）
    function getMockData(website) {
        // 模拟数据
        const mockData = {
            weibo: [
                { title: "中秋节快乐", url: "https://s.weibo.com/weibo?q=%23中秋节快乐%23", index: "3,872,450" },
                { title: "国庆假期安排", url: "https://s.weibo.com/weibo?q=%23国庆假期安排%23", index: "3,526,320" },
                { title: "苹果发布会", url: "https://s.weibo.com/weibo?q=%23苹果发布会%23", index: "3,125,890" },
                { title: "新冠疫情最新情况", url: "https://s.weibo.com/weibo?q=%23新冠疫情最新情况%23", index: "2,987,654" },
                { title: "中国女排世界杯夺冠", url: "https://s.weibo.com/weibo?q=%23中国女排世界杯夺冠%23", index: "2,854,321" },
                { title: "教师节祝福", url: "https://s.weibo.com/weibo?q=%23教师节祝福%23", index: "2,743,210" },
                { title: "高考志愿填报", url: "https://s.weibo.com/weibo?q=%23高考志愿填报%23", index: "2,654,987" },
                { title: "台风最新路径", url: "https://s.weibo.com/weibo?q=%23台风最新路径%23", index: "2,543,210" },
                { title: "NBA总决赛", url: "https://s.weibo.com/weibo?q=%23NBA总决赛%23", index: "2,432,109" },
                { title: "电影票房排行", url: "https://s.weibo.com/weibo?q=%23电影票房排行%23", index: "2,321,098" }
            ],

            baidu: [
                { title: "中秋国庆假期安排", url: "https://www.baidu.com/s?wd=中秋国庆假期安排", index: "4,987,654" },
                { title: "世界杯最新赛程", url: "https://www.baidu.com/s?wd=世界杯最新赛程", index: "4,876,543" },
                { title: "高考分数线公布", url: "https://www.baidu.com/s?wd=高考分数线公布", index: "4,765,432" },
                { title: "新冠疫情防控政策", url: "https://www.baidu.com/s?wd=新冠疫情防控政策", index: "4,654,321" },
                { title: "房价最新走势", url: "https://www.baidu.com/s?wd=房价最新走势", index: "4,543,210" },
                { title: "北京天气预报", url: "https://www.baidu.com/s?wd=北京天气预报", index: "4,432,109" },
                { title: "股市行情分析", url: "https://www.baidu.com/s?wd=股市行情分析", index: "4,321,098" },
                { title: "考研报名时间", url: "https://www.baidu.com/s?wd=考研报名时间", index: "4,210,987" },
                { title: "健康饮食指南", url: "https://www.baidu.com/s?wd=健康饮食指南", index: "4,109,876" },
                { title: "旅游景点推荐", url: "https://www.baidu.com/s?wd=旅游景点推荐", index: "3,998,765" }
            ],
            bilibili: [
                { title: "【美食】十分钟学会的家常菜", url: "https://www.bilibili.com/video/av12345678", index: "播放量：876.5万" },
                { title: "【游戏】最新游戏实况解说", url: "https://www.bilibili.com/video/av12345679", index: "播放量：765.4万" },
                { title: "【科技】最新手机评测", url: "https://www.bilibili.com/video/av12345680", index: "播放量：654.3万" },
                { title: "【动画】2025年新番推荐", url: "https://www.bilibili.com/video/av12345681", index: "播放量：543.2万" },
                { title: "【音乐】热门歌曲翻唱", url: "https://www.bilibili.com/video/av12345682", index: "播放量：432.1万" },
                { title: "【知识】十分钟了解量子力学", url: "https://www.bilibili.com/video/av12345683", index: "播放量：321.9万" },
                { title: "【生活】如何提高工作效率", url: "https://www.bilibili.com/video/av12345684", index: "播放量：298.7万" },
                { title: "【搞笑】沙雕日常合集", url: "https://www.bilibili.com/video/av12345685", index: "播放量：276.5万" },
                { title: "【运动】居家健身指南", url: "https://www.bilibili.com/video/av12345686", index: "播放量：254.3万" },
                { title: "【旅行】国内小众景点推荐", url: "https://www.bilibili.com/video/av12345687", index: "播放量：232.1万" }
            ],
            douban: [
                { title: "《流浪地球3》影评", url: "https://movie.douban.com/subject/12345678/", index: "评分：9.2" },
                { title: "《三体》电视剧讨论", url: "https://movie.douban.com/subject/12345679/", index: "评分：8.9" },
                { title: "2025年值得期待的新书", url: "https://book.douban.com/subject/12345680/", index: "评分：8.8" },
                { title: "《沙丘2》观后感", url: "https://movie.douban.com/subject/12345681/", index: "评分：8.7" },
                { title: "年度最佳国产剧排名", url: "https://movie.douban.com/subject/12345682/", index: "评分：8.6" },
                { title: "如何评价新专辑《东方之珠》", url: "https://music.douban.com/subject/12345683/", index: "评分：8.5" },
                { title: "《人类简史》读后感", url: "https://book.douban.com/subject/12345684/", index: "评分：8.4" },
                { title: "最新科幻小说推荐", url: "https://book.douban.com/subject/12345685/", index: "评分：8.3" },
                { title: "《星际穿越2》剧情讨论", url: "https://movie.douban.com/subject/12345686/", index: "评分：8.2" },
                { title: "年度最佳纪录片", url: "https://movie.douban.com/subject/12345687/", index: "评分：8.1" }
            ]
        };
        
        return mockData[website] || [];
    }
});