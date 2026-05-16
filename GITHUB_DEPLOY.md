# 📤 GitHub 推送指南

## 方法一：使用 Shell 脚本（最快）

### 步骤：
1. 生成 GitHub 个人访问令牌 (PAT)
   - 访问: https://github.com/settings/tokens
   - 点击 "Generate new token" -> "Generate new token (classic)"
   - 勾选 `repo` 完整权限
   - 生成并复制令牌

2. 运行推送脚本：
```bash
chmod +x push-to-github.sh
./push-to-github.sh YOUR_GITHUB_TOKEN_HERE
```

## 方法二：手动 Git 命令

```bash
cd /workspace

# 设置远程 URL（替换 YOUR_TOKEN）
git remote set-url origin https://YOUR_TOKEN@github.com/KyloHong/multi-language.git

# 添加所有文件
git add -A

# 提交
git commit -m "Add complete Figma i18n workflow project"

# 推送
git push -u origin main --force
```

## 方法三：使用 GitHub CLI (gh)

如果已安装 GitHub CLI：

```bash
# 登录
gh auth login

# 创建仓库（如果还没创建）
gh repo create KyloHong/multi-language --public --source=. --remote=origin --push
```

## 推送成功后的下一步

1. 访问 https://vercel.com
2. 连接您的 `KyloHong/multi-language` 仓库
3. 部署项目

## 项目文件说明

| 文件/目录 | 说明 |
|----------|------|
| `src/` | React 前端源代码 |
| `api/` | Express 后端 API |
| `vercel.json` | Vercel 部署配置 |
| `package.json` | 项目依赖配置 |

---

⚠️ **安全提示**：不要将 GitHub Token 提交到仓库！
