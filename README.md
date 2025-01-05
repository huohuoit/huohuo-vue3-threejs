# Vue3 + Three.js + TypeScript 项目

基于 Vue3、Three.js 和 TypeScript 的 3D 可视化项目。

## 技术栈

- Vue 3
- TypeScript
- Three.js
- Vite
- Pinia
- Vue Router
- Vitest

## 项目结构

```
src/
   ├── api/          # API 接口
   ├── assets/       # 静态资源
   ├── components/   # 组件
   ├── hooks/        # 自定义 hooks
   ├── router/       # 路由配置
   ├── stores/       # Pinia 状态管理
   ├── types/        # TypeScript 类型定义
   ├── utils/        # 工具函数
   └── views/        # 页面视图
```

## 开发环境设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test
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
npm run test

# 运行测试 UI
npm run test:ui

# 生成测试覆盖率报告
npm run test:coverage
```
