# Figma i18n Workflow 实施计划

## 1. 项目概述

本项目是一个完整的 Figma 多语言工作流应用，包含 React + TypeScript 前端和 Express 后端，实现从 Figma 设计稿的多语言处理流程。

## 2. 技术栈

**前端**：
- React 18 + TypeScript
- Vite 构建工具
- Zustand 状态管理
- TailwindCSS 样式
- Lucide React 图标
- React Router 路由

**后端**：
- Express + TypeScript
- Figma API 集成
- 模拟 AI 翻译服务

## 3. 项目结构

```
figma-i18n-workflow/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx              # 首页 - Figma 链接输入
│   │   │   ├── TextPreview.tsx     # 文本预览页
│   │   │   ├── BrandPlatformSelector.tsx  # 品牌平台选择页
│   │   │   ├── TranslationViewer.tsx  # 翻译查看页
│   │   │   └── AIProofreading.tsx  # AI 校对页
│   │   ├── components/
│   │   │   ├── Layout.tsx          # 布局组件
│   │   │   ├── Header.tsx         # 顶部导航
│   │   │   ├── Card.tsx          # 卡片组件
│   │   │   ├── Button.tsx        # 按钮组件
│   │   │   ├── ProgressBar.tsx    # 进度条
│   │   │   └── TextNodeItem.tsx   # 文本节点项
│   │   ├── store/
│   │   │   └── useAppStore.ts     # Zustand 状态管理
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript 类型定义
│   │   ├── services/
│   │   │   └── api.ts            # API 调用服务
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── api/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── figma.ts          # Figma 相关路由
│   │   │   ├── translation.ts    # 翻译相关路由
│   │   │   └── brand.ts          # 品牌平台路由
│   │   ├── services/
│   │   │   ├── figmaService.ts   # Figma 业务逻辑
│   │   │   ├── translationService.ts  # 翻译业务逻辑
│   │   │   └── brandService.ts     # 品牌业务逻辑
│   │   ├── types/
│   │   │   └── index.ts          # 后端类型定义
│   │   └── server.ts
│   └── package.json
└── shared/
    └── types.ts                  # 共享类型
```

## 4. 核心功能设计

### 4.1 类型定义 (shared/types.ts

```typescript
// Figma 相关
export interface TextNode {
  id: string;
  name: string;
  content: string;
  path: string;
  type: 'TEXT';
}

// 品牌和平台
export interface Platform {
  id: string;
  name: string;
  languages: string[];
}

export interface Brand {
  id: string;
  name: string;
  platforms: Platform[];
}

// 翻译相关
export interface Translation {
  original: string;
  translated: Record<string, string>;
  qualityScore?: number;
  duplicates?: string[];
  suggestions?: string[];
}

export interface TextWithTranslation {
  node: TextNode;
  translation: Translation;
}

// 应用状态
export interface AppState {
  step: number;
  figmaUrl: string;
  extractedTexts: TextNode[];
  selectedBrand: Brand | null;
  selectedPlatform: Platform | null;
  translations: TextWithTranslation[];
}
```

### 4.2 品牌和平台模拟数据

```
AU Brand:
  - IB Portal: ['en-AU', 'zh-CN', 'ja']
  - Admin Portal: ['en-AU', 'zh-CN']

EU Brand:
  - IB Portal: ['en-GB', 'de', 'fr', 'es']
  - Admin Portal: ['en-GB', 'de']

US Brand:
  - IB Portal: ['en-US', 'es']
  - Admin Portal: ['en-US']
```

### 4.3 API 端点设计

- `GET /api/figma/extract?url=xxx` - 从 Figma 链接提取文本
- `POST /api/translation/translate` - 翻译文本
- `GET /api/translation/proofread` - AI 校对
- `GET /api/brands` - 获取品牌列表
- `GET /api/brands/:id/platforms` - 获取品牌平台
- `POST /api/export` - 导出数据 (JSON/CSV)

## 5. 实施步骤

### 阶段 1: 项目初始化
1. 创建项目目录结构
2. 初始化前端 Vite 项目
3. 初始化后端 Express 项目
4. 配置 TypeScript
5. 安装依赖

### 阶段 2: 类型和共享代码
1. 创建共享类型定义
2. 创建品牌平台模拟数据

### 阶段 3: 后端实现
1. Express 服务器设置
2. Figma API 集成 (模拟)
3. 翻译服务 (模拟)
4. 品牌平台服务
5. API 路由实现

### 阶段 4: 前端实现
1. 配置 TailwindCSS 和 Lucide
2. 创建布局和通用组件
3. 实现 Zustand 状态管理
4. 创建 5 个页面组件
5. 配置路由
6. 实现 API 服务调用

### 阶段 5: UI 美化和优化
1. 应用配色方案 (深蓝 #1e40af + 青 #06b6d4)
2. 卡片式布局
3. 添加动画效果
4. 响应式设计

### 阶段 6: 测试和验证
1. 功能测试
2. 集成测试

## 6. 设计规范

### 配色方案
- 主色：深蓝 #1e40af
- 强调色：青色 #06b6d4
- 背景：浅灰 #f8fafc
- 文本：深灰 #1f2937

### 组件样式
- 卡片：圆角 8px，阴影
- 按钮：圆角 6px
- 动画：平滑过渡 0.3s

## 7. 交付物

完成后将提供：
1. 完整的项目结构
2. 前端和后端完整代码
3. 可运行的应用
4. 功能说明文档
