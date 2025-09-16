class SimpleCache {
    constructor(ttl = 300000) { // 默认5分钟
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key, value, ttl = this.ttl) {
        const expireAt = Date.now() + ttl;
        this.cache.set(key, { value, expireAt });
        return true;
    }

    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }

        if (Date.now() > item.expireAt) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    delete(key) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    size() {
        return this.cache.size;
    }

    // 清理过期缓存
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expireAt) {
                this.cache.delete(key);
            }
        }
    }
}

// 创建全局缓存实例
const cache = new SimpleCache();

// 定时清理过期缓存（每小时一次）
setInterval(() => {
    cache.cleanup();
}, 3600000);

module.exports = cache;