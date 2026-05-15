# Figma 多语言工作流 Skill

## 概述

这是一个完整的 Figma 多语言翻译工作流应用，能够自动从 Figma 设计稿中提取文案，进行 AI 翻译，并生成多语言文档。

## 功能特性

### 1. Figma 集成
- 支持 Figma 文件链接输入
- 自动提取设计稿中的文案
- 支持 Personal Access Token 认证
- 包含模拟数据用于演示

### 2. 文案预览与编辑
- 展示提取的文案列表
- 支持搜索和筛选
- 支持在线编辑文案
- 显示文案所在页面和框架

### 3. 品牌平台配置
- 预设品牌配置（AU、EU、US）
- 每个品牌包含多个平台
- 每个平台配置对应的目标语言
- 灵活的品牌和平台扩展机制

### 4. AI 翻译
- 自动翻译提取的文案
- 支持多种目标语言
- 支持编辑和调整翻译
- 翻译结果实时预览

### 5. AI 校对
- 重复文案检测
- 场景分析（相同/不同场景）
- 翻译质量评估
- 智能去重建议

### 6. 文档导出
- 支持 JSON 格式导出
- 支持 CSV 格式导出
- 包含品牌和平台信息

## 技术栈

### 前端
- React 18 + TypeScript
- Vite（构建工具）
- Tailwind CSS（样式）
- Zustand（状态管理）
- Lucide React（图标库）

### 后端
- Express + TypeScript（基础架构）
- 可扩展的 API 设计

## 项目结构

```
/workspace
├── src/
│   ├── components/
│   │   └── WorkflowSteps.tsx      # 工作流步骤指示器
│   ├── pages/
│   │   ├── UploadPage.tsx         # Figma 上传页面
│   │   ├── PreviewPage.tsx        # 文案预览页面
│   │   ├── BrandPlatformPage.tsx  # 品牌平台选择页面
│   │   ├── TranslatePage.tsx      # 翻译页面
│   │   ├── ProofreadPage.tsx      # 校对页面
│   │   └── CompletePage.tsx       # 完成页面
│   ├── store/
│   │   └── index.ts               # Zustand 状态管理
│   ├── types/
│   │   └── index.ts               # TypeScript 类型定义
│   ├── config/
│   │   └── brands.ts              # 品牌和平台配置
│   ├── App.tsx                    # 主应用组件
│   └── main.tsx                   # 应用入口
├── api/
│   └── index.ts                   # 后端 API
├── dist/                          # 构建输出
└── package.json
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

## 使用流程

### 1. 上传 Figma 文件
- 输入 Figma 设计稿链接
- 可选：输入 Personal Access Token
- 点击"提取文案"按钮

### 2. 预览和编辑文案
- 查看提取的所有文案
- 搜索和筛选文案
- 编辑或删除不需要的文案
- 点击"下一步"继续

### 3. 选择品牌和平台
- 选择目标品牌（AU、EU、US）
- 选择对应的平台
- 查看支持的语言列表
- 点击"下一步"继续

### 4. 翻译文案
- 查看自动生成的翻译
- 编辑和调整翻译结果
- 点击"下一步"继续

### 5. AI 校对
- 查看重复文案检测结果
- 查看翻译质量评估
- 导出多语言文档（JSON/CSV）
- 点击"完成"结束工作流

## 配置说明

### 品牌和平台配置

在 `src/config/brands.ts` 中添加或修改品牌和平台配置：

```typescript
export const BRANDS: Brand[] = [
  {
    id: 'your-brand-id',
    name: 'Your Brand Name',
    platforms: [
      {
        id: 'your-platform-id',
        name: 'Your Platform Name',
        languages: ['en', 'zh-CN', 'ja'],  // 目标语言列表
      },
    ],
  },
];
```

### 语言名称映射

在 `src/config/brands.ts` 中配置语言代码到显示名称的映射：

```typescript
export const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'zh-CN': '简体中文',
  // 添加更多语言...
};
```

## 状态管理

应用使用 Zustand 进行状态管理，主要状态包括：

- `currentStep`: 当前工作流步骤
- `figmaUrl`: Figma 文件链接
- `accessToken`: Figma 访问令牌
- `extractedTexts`: 提取的文案列表
- `selectedBrand`: 选中的品牌
- `selectedPlatform`: 选中的平台
- `translations`: 翻译结果
- `proofreadResult`: 校对结果

## 工作流步骤

```
upload (上传) → preview (预览) → brand (品牌选择) → 
translate (翻译) → proofread (校对) → complete (完成)
```

## 扩展开发

### 添加新的品牌和平台

1. 在 `src/config/brands.ts` 中添加新的品牌配置
2. 配置该品牌支持的平台和语言

### 集成真实的 Figma API

1. 在后端实现 Figma API 调用
2. 替换 `UploadPage.tsx` 中的模拟数据
3. 处理 API 认证和错误

### 集成真实的 AI 翻译服务

1. 在后端集成翻译 API（如 Google Translate、DeepL 等）
2. 替换 `TranslatePage.tsx` 中的模拟翻译
3. 添加翻译质量评估逻辑

## 设计特点

### UI/UX
- 现代化的渐变设计
- 清晰的视觉层级
- 流畅的动画过渡
- 响应式布局
- 直观的操作流程

### 技术特点
- 完全类型安全的 TypeScript
- 组件化架构
- 可扩展的状态管理
- 模块化的配置系统

## License

MIT
