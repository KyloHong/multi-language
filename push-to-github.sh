#!/bin/bash

# Figma 多语言工作流 - GitHub 自动推送脚本
# 使用方法：
# 1. 在 GitHub 创建个人访问令牌 (PAT)
# 2. 运行: ./push-to-github.sh YOUR_GITHUB_TOKEN

GITHUB_TOKEN=$1
REPO_OWNER="KyloHong"
REPO_NAME="multi-language"
BRANCH="main"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ 错误: 请提供 GitHub 个人访问令牌作为参数"
  echo "使用方法: ./push-to-github.sh YOUR_GITHUB_TOKEN"
  echo ""
  echo "获取 GitHub Token 步骤："
  echo "1. 访问 https://github.com/settings/tokens"
  echo "2. 点击 'Generate new token' -> 'Generate new token (classic)'"
  echo "3. 选择 'repo' 权限"
  echo "4. 生成并复制令牌"
  exit 1
fi

echo "🚀 开始推送到 GitHub..."

# 配置远程仓库 URL（包含 token）
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"

# 确保所有文件都被添加
git add -A

# 提交
git commit -m "Add complete Figma i18n workflow project" --allow-empty

# 强制推送
git push -u origin $BRANCH --force

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 成功推送到 GitHub!"
  echo "📦 仓库地址: https://github.com/${REPO_OWNER}/${REPO_NAME}"
  echo ""
  echo "下一步："
  echo "1. 访问 https://vercel.com 连接您的仓库"
  echo "2. 部署项目"
else
  echo "❌ 推送失败，请检查您的 GitHub Token 权限"
fi
