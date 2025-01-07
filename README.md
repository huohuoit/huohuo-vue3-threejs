# Vue3 + Three.js + TypeScript 项目

基于 Vue3、Three.js 和 TypeScript 的 3D 可视化项目。

## 技术栈

- Vue 3
- TypeScript
- Three.js
- Vite
- Pinia
- UnoCSS
- Vue Router
- Vitest

## 项目结构

```bash
├── public/                 # 静态公共资源
├── src/
│   ├── assets/            # 静态资源
│   │   ├── images/        # 图片资源
│   │   ├── models/        # 3D 模型文件
│   │   └── styles/        # 全局样式
│   ├── components/        # 公共组件
│   │   ├── three/        # Three.js 相关组件
│   │   └── ui/           # UI 组件
│   ├── composables/       # 组合式函数
│   ├── config/           # 配置文件
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   │   ├── three/       # Three.js 相关工具
│   │   └── common/      # 通用工具
│   └── views/           # 页面视图
├── tests/                # 测试文件
├── env.d.ts             # 环境变量类型声明
└── vite.config.ts       # Vite 配置
```

## 开发环境设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test
```

## 开发指南

### 创建新的 3D 场景

1. 在 `components` 目录下创建新的场景组件
2. 使用 `useThreeScene` hook 初始化场景
3. 在 `views` 中创建对应的页面组件

### 添加新的功能

1. 在 `types` 中定义相关接口
2. 在 `utils` 中添加工具函数
3. 在 `stores` 中管理状态
4. 在 `components` 中实现功能组件

## 测试

```bash
# 运行单元测试
pnpm test

# 运行测试 UI
pnpm test:ui

# 生成测试覆盖率报告
pnpm test:coverage
```
