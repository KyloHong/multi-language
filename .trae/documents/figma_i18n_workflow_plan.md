# Figma多语言工作流实现计划

## 1. 用户需求理解

用户需要构建一个自动化工作流，解决从Figma设计稿到多语言文档的翻译问题：
- 传统方式：从UI设计稿手动扒文案 → 发给翻译 → 生成多语言文档
- 新方式：AI直接识别Figma文案 → 自动生成对应多语言文档

## 2. 工作流步骤

1. **上传Figma文件** - 支持读取Figma链接
2. **识别文案** - 从Figma文件中提取所有文案
3. **品牌平台选择** - 提示用户选择对应的品牌和平台（如AU品牌的IB portal平台）
4. **多语言映射** - 按对应的品牌多语言模版进行一一对应
5. **输出文档** - 生成多语言模版文件
6. **AI校对** - 检查重复字段、去重、评估翻译质量、提示修改

## 3. 技术方案设计

### 3.1 技术栈选择
- **前端**：React + TypeScript（使用web-artisan skill快速构建）
- **后端API**：Node.js + Express（用于处理Figma API调用、AI接口等）
- **Figma集成**：使用Figma REST API读取文件和节点
- **AI集成**：LLM接口用于文案识别、翻译和校对
- **状态管理**：React Context或Zustand

### 3.2 核心模块划分
```
figma-i18n-workflow/
├── frontend/                # React前端应用
│   ├── src/
│   │   ├── components/      # 组件
│   │   │   ├── FigmaUploader.tsx
│   │   │   ├── BrandPlatformSelector.tsx
│   │   │   ├── TextPreview.tsx
│   │   │   └── I18nOutput.tsx
│   │   ├── services/        # API服务
│   │   └── types/           # 类型定义
├── backend/                 # Node.js后端
│   ├── src/
│   │   ├── routes/          # API路由
│   │   ├── services/        # 业务逻辑
│   │   └── utils/           # 工具函数
└── shared/                  # 共享类型和配置
```

## 4. 实施步骤

### 阶段一：项目初始化
1. 创建前端React项目
2. 创建后端Node.js项目
3. 配置开发环境和依赖

### 阶段二：Figma集成
1. 实现Figma文件上传/链接输入
2. 调用Figma API获取文件内容
3. 实现文案提取逻辑

### 阶段三：品牌平台配置
1. 设计品牌和平台配置数据结构
2. 实现品牌平台选择界面
3. 配置各平台对应的多语言种类

### 阶段四：AI翻译与映射
1. 集成LLM进行文案识别
2. 实现多语言模版映射
3. 生成多语言文档

### 阶段五：AI校对功能
1. 实现重复字段检测
2. 实现场景分析与去重
3. 实现翻译质量评估
4. 实现修改建议提示

### 阶段六：完善与优化
1. UI/UX优化
2. 错误处理和用户反馈
3. 测试与调试

## 5. 关键技术点

### 5.1 Figma API使用
- 认证：Personal Access Token
- 端点：`/files/:file_key` 获取文件内容
- 端点：`/nodes` 获取特定节点
- 文案提取：遍历节点树，提取TEXT类型节点

### 5.2 品牌平台配置示例
```typescript
interface Brand {
  id: string;
  name: string;
  platforms: Platform[];
}

interface Platform {
  id: string;
  name: string;
  languages: string[];  // 如 ['en', 'zh-CN', 'ja']
  templateFormat: string;
}
```

### 5.3 AI校对逻辑
1. 重复字段检测：基于文案内容哈希
2. 场景分析：基于节点位置、组件上下文
3. 翻译质量评估：LLM评分和建议

## 6. 风险与考量

- **Figma API限流**：需要处理API限流，添加重试机制
- **文案识别准确度**：需要优化提取逻辑，处理特殊字符和格式
- **翻译质量**：需要允许人工审核和修改
- **数据安全**：Figma token和文案内容需要安全存储

## 7. Skill沉淀

完成后将沉淀为 `figma-i18n-workflow` skill，包含：
- 完整的工作流实现
- 可复用的组件和服务
- 配置模板和文档
