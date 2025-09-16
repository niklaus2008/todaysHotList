#!/bin/bash

# Today's HotList 启动脚本
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        error "错误: $1 未安装"
        exit 1
    fi
}

# 检查环境变量
check_env() {
    if [ -z "$GITHUB_TOKEN" ]; then
        warn "警告: GITHUB_TOKEN 未设置，API调用将受到限制"
    fi
}

# 等待端口就绪
wait_for_port() {
    local port=$1
    local timeout=${2:-30}
    local start_time=$(date +%s)
    
    while ! nc -z localhost $port; do
        if [ $(($(date +%s) - start_time)) -gt $timeout ]; then
            error "错误: 端口 $port 在 $timeout 秒内未就绪"
            exit 1
        fi
        sleep 1
    done
}

# 主函数
main() {
    log "开始启动 Today's HotList 服务..."
    
    # 检查必要命令
    check_command node
    check_command npm
    
    # 检查环境变量
    check_env
    
    # 安装依赖（如果不存在）
    if [ ! -d "node_modules" ]; then
        log "安装依赖..."
        npm install
    fi
    
    # 检查环境文件
    if [ ! -f ".env" ]; then
        warn ".env 文件不存在，使用默认配置"
        cp .env.example .env 2>/dev/null || true
    fi
    
    # 设置环境
    export NODE_ENV=${NODE_ENV:-production}
    
    if [ "$NODE_ENV" = "production" ]; then
        log "生产环境启动..."
        # 启动应用
        exec node server.js
    else
        log "开发环境启动..."
        # 检查 nodemon 是否安装
        if ! command -v nodemon &> /dev/null; then
            npm install -g nodemon
        fi
        # 开发模式启动
        exec nodemon server.js
    fi
}

# 异常处理
trap 'error "服务启动失败"; exit 1' ERR

# 执行主函数
main "$@"