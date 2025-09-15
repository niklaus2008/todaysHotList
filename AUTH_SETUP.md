# 知乎API个人认证配置指南

## 如何获取知乎登录Cookie

### 方法一：通过浏览器开发者工具

1. **登录知乎网站**
   - 打开 https://www.zhihu.com
   - 使用您的知乎账号登录

2. **打开开发者工具**
   - 按 `F12` 或右键选择"检查"
   - 切换到 `Network` (网络) 标签页

3. **刷新页面并查找请求**
   - 刷新知乎首页
   - 在网络请求列表中查找 `hot-lists` 或 `total` 相关的请求

4. **复制Cookie**
   - 点击该请求，在 `Headers` 标签页中找到 `Cookie` 字段
   - 复制完整的Cookie值

### 方法二：查看浏览器存储的Cookie

1. **打开浏览器开发者工具**
   - 按 `F12` 打开开发者工具
   - 切换到 `Application` (应用) 标签页

2. **查看Cookie**
   - 在左侧选择 `Storage` → `Cookies` → `https://www.zhihu.com`
   - 复制所有Cookie的值（通常包括 `z_c0`, `_xsrf` 等）

## 配置认证信息

### 临时设置（当前会话有效）

```bash
# 设置环境变量
export ZHIHU_COOKIE="您的完整Cookie字符串"

# 然后启动服务器
npm start
```

### 永久设置（创建环境配置文件）

1. **创建 `.env` 文件**
```bash
echo 'ZHIHU_COOKIE=您的完整Cookie字符串' > .env
```

2. **安装dotenv依赖**
```bash
npm install dotenv
```

3. **修改server.js加载环境变量**
```javascript
require('dotenv').config();
```

## Cookie格式示例

```
z_c0="2|1:0|10:1234567890|4:z_c0|32:abcd1234efgh5678ijkl90mnopqrstuvwxyz|abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"; _xsrf=abcd1234efgh5678; other_cookie=value
```

## 验证认证是否生效

1. **启动服务器**
```bash
npm start
```

2. **检查认证状态**
```bash
curl http://localhost:3002/api/auth/config
```

3. **测试热榜接口**
```bash
curl http://localhost:3002/api/zhihu-hot
```

## 注意事项

- 🔒 **安全警告**: 不要将Cookie提交到版本控制系统
- ⏰ **有效期**: Cookie通常有有效期，需要定期更新
- 🌐 **地域限制**: 某些内容可能有地域访问限制
- 📱 **账号安全**: 使用专用账号或注意账号安全

## 常见问题

**Q: Cookie无效或过期怎么办？**
A: 重新登录知乎并获取新的Cookie

**Q: 仍然获取不到数据怎么办？**
A: 检查网络连接，确认Cookie格式正确

**Q: 如何确认认证成功？**
A: 调用 `/api/auth/config` 接口检查认证状态