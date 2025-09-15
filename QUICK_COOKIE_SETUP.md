# 快速设置知乎Cookie

## 最简单的方法：

1. **打开Chrome/Edge浏览器**
2. **访问**: https://www.zhihu.com
3. **登录**您的知乎账号
4. **按F12**打开开发者工具
5. **切换到Console(控制台)**标签
6. **复制粘贴以下代码**并回车：

```javascript
// 获取知乎cookie并复制到剪贴板
const cookies = document.cookie;
const zhihuCookies = cookies.split(';')
  .filter(cookie => cookie.includes('z_c0') || cookie.includes('_xsrf') || cookie.includes('d_c0'))
  .join(';')
  .trim();

copy(zhihuCookies);
console.log('✅ Cookie已复制到剪贴板：', zhihuCookies);
console.log('📋 现在请粘贴到.env文件的ZHIHU_COOKIE中');
```

7. **编辑.env文件**，将复制的cookie粘贴替换第4行：

```bash
ZHIHU_COOKIE="粘贴这里您的真实cookie"
```

8. **重启服务器**：
```bash
pkill -f "node server.js"
node server.js &
```

## 验证配置：

```bash
curl http://localhost:3002/api/auth/config
```

如果显示 `"hasAuth": true` 表示成功。

## 如果上述方法不工作：

1. 手动在浏览器地址栏输入：
   ```
   javascript:copy(document.cookie);alert('Cookie已复制到剪贴板');
   ```
2. 然后将剪贴板内容粘贴到.env文件中