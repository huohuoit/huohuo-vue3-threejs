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

当前：

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

未来：

```bash
├── public/                 # 静态公共资源
│   ├── models/            # 公共 3D 模型
│   └── textures/          # 公共纹理资源
├── src/
│   ├── assets/            # 静态资源
│   │   ├── images/        # 图片资源
│   │   ├── models/        # 3D 模型文件
│   │   ├── textures/      # 纹理文件
│   │   └── styles/        # 全局样式
│   ├── components/        # 公共组件
│   │   ├── three/        # Three.js 相关组件
│   │   │   ├── controls/ # 控制器组件
│   │   │   ├── lights/   # 光源组件
│   │   │   └── objects/  # 3D 对象组件
│   │   └── ui/           # UI 组件
│   ├── composables/       # 组合式函数
│   │   ├── three/        # Three.js 相关 hooks
│   │   └── ui/           # UI 相关 hooks
│   ├── config/           # 配置文件
│   │   ├── three/        # Three.js 配置
│   │   └── app/          # 应用配置
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   │   ├── modules/      # 状态模块
│   │   └── index.ts      # 状态入口
│   ├── types/            # TypeScript 类型定义
│   │   ├── three/        # Three.js 相关类型
│   │   ├── components/   # 组件类型
│   │   └── store/        # 状态类型
│   ├── utils/            # 工具函数
│   │   ├── three/        # Three.js 相关工具
│   │   │   ├── loaders/  # 加载器
│   │   │   └── helpers/  # 辅助函数
│   │   └── common/       # 通用工具
│   └── views/            # 页面视图
│       ├── scene/        # 3D 场景页面
│       └── home/         # 主页
├── tests/                # 测试文件
│   ├── unit/            # 单元测试
│   └── e2e/             # 端到端测试
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
