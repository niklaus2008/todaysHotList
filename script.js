// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const websiteSelector = document.getElementById('website-selector');
    const hotListContainer = document.getElementById('hot-list-container');
    const hotList = document.getElementById('hot-list');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const retryButton = document.getElementById('retry-button');
    
    // 监听下拉框变化事件
    websiteSelector.addEventListener('change', function() {
        const selectedWebsite = this.value;
        if (selectedWebsite) {
            fetchHotList(selectedWebsite);
        }
    });

    // 重试按钮点击事件
    if (retryButton) {
        retryButton.addEventListener('click', function() {
            const selectedWebsite = websiteSelector.value;
            if (selectedWebsite) {
                fetchHotList(selectedWebsite);
            }
        });
    }
    
    // 检查本地存储中是否有上次选择
    const lastSelectedWebsite = localStorage.getItem('lastSelectedWebsite');
    if (lastSelectedWebsite && websiteSelector.querySelector(`option[value="${lastSelectedWebsite}"]`)) {
        websiteSelector.value = lastSelectedWebsite;
        fetchHotList(lastSelectedWebsite);
    }
    
    // 获取热榜数据
    async function fetchHotList(website) {
        // 保存选择到本地存储
        localStorage.setItem('lastSelectedWebsite', website);
        
        // 显示加载动画
        showLoading();
        
        // 清空之前的列表
        hotList.innerHTML = '';
        
        try {
            let apiUrl;
            let data;
            
            // 检查本地缓存
            const cacheKey = `hotlist:${website}`;
            const cachedData = localStorage.getItem(cacheKey);
            const cachedTimestamp = localStorage.getItem(`${cacheKey}:timestamp`);
            
            // 如果缓存存在且未过期（5分钟）
            if (cachedData && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < 300000) {
                data = JSON.parse(cachedData);
                renderHotList(data, website);
                hideLoading();
                return;
            }
            
            // 根据选择的网站调用不同的API
            if (website === 'github') {
                apiUrl = '/api/github/repositories?perPage=10';
                const response = await fetchWithTimeout(apiUrl, { timeout: 10000 });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
                
                const result = await response.json();
                if (result.success) {
                    data = result.data.map(repo => ({
                        title: repo.fullName || repo.name,
                        url: repo.url,
                        index: `${formatNumber(repo.stars)} stars`,
                        description: repo.description,
                        language: repo.language
                    }));
                    
                    // 缓存数据
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                    localStorage.setItem(`${cacheKey}:timestamp`, Date.now().toString());
                } else {
                    throw new Error(result.error || 'GitHub API返回错误');
                }
            } else {
                // 其他网站暂时使用模拟数据
                data = getMockData(website);
                // 模拟数据也缓存
                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(`${cacheKey}:timestamp`, Date.now().toString());
            }
            
            renderHotList(data, website);
            hideLoading();
        } catch (error) {
            console.error('获取数据失败:', error);
            showError(`获取数据失败: ${error.message}`);
        }
    }
    
    // 带超时的fetch函数
    async function fetchWithTimeout(resource, options = {}) {
        const { timeout = 8000 } = options;
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        
        clearTimeout(id);
        return response;
    }

    // 数字格式化
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 显示加载动画
    function showLoading() {
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        hotList.classList.add('hidden');
        const placeholder = document.querySelector('.placeholder-message');
        if (placeholder) {
            placeholder.classList.add('hidden');
        }
    }
    
    // 隐藏加载动画
    function hideLoading() {
        loadingElement.classList.add('hidden');
        hotList.classList.remove('hidden');
    }
    
    // 显示错误信息
    function showError(message = '获取数据失败，请稍后再试') {
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
        errorElement.innerHTML = `
            <p>${message}</p>
            <button id="retry-button" class="retry-button">重试</button>
        `;
        hotList.classList.add('hidden');
        
        // 重新绑定重试按钮事件
        const retryBtn = document.getElementById('retry-button');
        if (retryBtn) {
            retryBtn.addEventListener('click', function() {
                const selectedWebsite = websiteSelector.value;
                if (selectedWebsite) {
                    fetchHotList(selectedWebsite);
                }
            });
        }
    }
    
    // 渲染热榜列表
    function renderHotList(data, website) {
        hotList.innerHTML = '';
        
        if (!data || data.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无数据';
            hotList.appendChild(emptyMessage);
            return;
        }
        
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
            titleLink.target = '_blank';
            titleLink.rel = 'noopener noreferrer';
            
            // 创建热度指数元素
            const indexSpan = document.createElement('span');
            indexSpan.className = 'hot-index';
            indexSpan.textContent = item.index;
            
            // 创建复制链接按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-link-btn';
            copyButton.innerHTML = '📋 复制链接';
            copyButton.title = '复制链接';
            copyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                copyToClipboard(item.url);
                
                // 显示复制成功提示
                copyButton.innerHTML = '✅ 已复制';
                copyButton.classList.add('copied');
                
                // 2秒后恢复原状
                setTimeout(() => {
                    copyButton.innerHTML = '📋 复制链接';
                    copyButton.classList.remove('copied');
                }, 2000);
            });
            
            // 创建内容容器
            const contentDiv = document.createElement('div');
            contentDiv.className = 'hot-content';
            
            // 添加描述（如果有）
            if (item.description) {
                const descSpan = document.createElement('p');
                descSpan.className = 'hot-description';
                descSpan.textContent = item.description;
                contentDiv.appendChild(descSpan);
            }
            
            // 添加语言标签（如果有）
            if (item.language) {
                const langSpan = document.createElement('span');
                langSpan.className = 'hot-language';
                langSpan.textContent = item.language;
                contentDiv.appendChild(langSpan);
            }
            
            // 将元素添加到列表项
            listItem.appendChild(rankSpan);
            listItem.appendChild(titleLink);
            listItem.appendChild(indexSpan);
            listItem.appendChild(copyButton);
            listItem.appendChild(contentDiv);
            
            // 将列表项添加到热榜列表
            hotList.appendChild(listItem);
        });
    }
    
    // 复制到剪贴板函数
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            // 使用现代 Clipboard API
            navigator.clipboard.writeText(text).catch(err => {
                console.error('复制失败:', err);
                fallbackCopyToClipboard(text);
            });
        } else {
            // 使用传统的execCommand方法作为备选
            fallbackCopyToClipboard(text);
        }
    }
    
    // 传统的复制方法
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (!successful) {
                console.error('复制失败');
            }
        } catch (err) {
            console.error('复制失败:', err);
        }
        
        document.body.removeChild(textArea);
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