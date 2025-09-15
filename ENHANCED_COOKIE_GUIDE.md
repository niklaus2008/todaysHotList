# 增强版Cookie获取指南

## 当前问题分析
您的cookie配置已生效，但知乎API仍然返回认证错误。这通常是因为：

1. **Cookie过期** - 需要重新登录获取新的
2. **缺少关键字段** - 需要更多认证信息
3. **环境限制** - 服务器IP可能被限制

## 完整Cookie获取步骤

### 方法一：获取所有相关Cookie
1. 登录知乎后，在浏览器控制台执行：
```javascript
// 获取所有知乎相关cookie
const allCookies = document.cookie;
const zhihuCookies = allCookies.split(';')
  .filter(cookie => 
    cookie.includes('z_c0') || 
    cookie.includes('_xsrf') || 
    cookie.includes('d_c0') ||
    cookie.includes('_zap') ||
    cookie.includes('__ut') ||
    cookie.includes('SESSION')
  )
  .map(cookie => cookie.trim())
  .join('; ');

copy(zhihuCookies);
console.log('完整Cookie已复制：', zhihuCookies);
```

### 方法二：直接从网络请求获取
1. 按F12 → Network标签
2. 访问 https://www.zhihu.com/hot
3. 找到 `hot-lists/total` 请求
4. 在Headers中复制完整的 `Cookie` 头

### 方法三：检查Cookie有效期
在浏览器控制台检查cookie状态：
```javascript
// 检查cookie有效期
function checkCookieExpiry() {
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name.includes('z_c0') || name.includes('_xsrf')) {
      console.log(`${name}: ${value.length}字符`);
    }
  });
}
checkCookieExpiry();
```

## 推荐的完整Cookie格式
```bash
ZHIHU_COOKIE="z_c0=您的z_c0值; _xsrf=您的_xsrf值; d_c0=您的d_c0值; _zap=您的_zap值; SESSION=您的session值"
```

## 验证Cookie有效性
1. 在浏览器中访问：https://www.zhihu.com
2. 确保页面正常显示（不是登录页面）
3. 如果能正常浏览内容，说明cookie有效

## 如果仍然失败
1. **清除浏览器缓存**后重新登录
2. **使用隐私/无痕窗口**获取新cookie
3. **等待几分钟**后重试，有时需要时间生效

请尝试获取更完整的cookie信息后更新.env文件。