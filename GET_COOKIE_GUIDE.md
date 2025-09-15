# 获取知乎Cookie详细指南

## 方法一：通过浏览器开发者工具（推荐）

### 步骤1：登录知乎
1. 打开浏览器，访问：https://www.zhihu.com
2. 使用您的知乎账号密码登录

### 步骤2：打开开发者工具
- **Windows/Linux**: 按 `F12` 键
- **Mac**: 按 `Command + Option + I` 键
- 或者右键页面选择"检查"

### 步骤3：监控网络请求
1. 切换到 `Network` (网络) 标签页
2. 勾选 `Preserve log` (保留日志)
3. 刷新知乎页面 (按 `F5` 或 `Command + R`)

### 步骤4：查找热榜请求
1. 在筛选框中输入 `hot-lists` 或 `total`
2. 点击出现的请求（通常是 `topstory/hot-lists/total`）
3. 在 `Headers` 标签页中找到 `Request Headers` 部分
4. 复制完整的 `Cookie` 值

## 方法二：查看存储的Cookie

### 步骤1：打开开发者工具
按 `F12` 打开开发者工具

### 步骤2：查看应用存储
1. 切换到 `Application` (应用) 标签页
2. 在左侧选择 `Storage` → `Cookies` → `https://www.zhihu.com`
3. 复制所有Cookie的值

### 重要Cookie字段：
- `z_c0`: 主要的认证cookie
- `_xsrf`: 防跨站请求伪造token
- `d_c0`: 设备标识cookie

## 配置到项目中

### 步骤1：编辑.env文件
用文本编辑器打开 `.env` 文件，替换示例值：

```bash
# 将这一行替换为您的真实cookie
ZHIHU_COOKIE="z_c0=您的真实z_c0值; _xsrf=您的_xsrf值; d_c0=您的d_c0值"
```

### 步骤2：重启服务器
```bash
# 先停止现有服务器
pkill -f "node server.js"

# 重新启动
node server.js &
```

### 步骤3：验证配置
```bash
curl http://localhost:3002/api/auth/config
```

如果显示 `"hasAuth": true` 表示配置成功。

## 注意事项

1. **Cookie安全**: 不要分享您的cookie，它相当于您的账号密码
2. **有效期**: Cookie会过期，需要定期更新
3. **格式**: 确保cookie格式正确，包含所有必要的字段
4. **编码**: 特殊字符可能需要正确转义

## 常见问题

**Q: 找不到hot-lists请求怎么办？**
A: 尝试访问 https://www.zhihu.com/hot 页面，然后查看网络请求

**Q: Cookie很快失效怎么办？**
A: 这是正常现象，需要重新登录获取新的cookie

**Q: 多个cookie如何拼接？**
A: 用分号分隔，例如: `cookie1=value1; cookie2=value2; cookie3=value3`

如果需要进一步帮助，请提供您遇到的具体问题。