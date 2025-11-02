# MacOS风格桌面应用界面

一个基于React、TypeScript和Tailwind CSS构建的现代化桌面应用界面，模拟MacOS的用户体验，提供流畅的交互和精美的视觉效果。

## ✨ 主要功能

### 1. 美观的桌面环境
- 默认主题壁纸（`src/assets/image/wallpaper/coffe.png`）
- 深色/浅色主题无缝切换，支持系统主题同步
- 苹果风格的顶部菜单栏，包含App、文件、编辑、视图、窗口和帮助等菜单
- 液态玻璃效果的底部Dock栏，展示彩色应用图标

### 2. 窗口管理系统
- 可拖拽移动窗口位置
- 支持调整窗口大小
- 窗口最大化、最小化和关闭功能
- 窗口层级管理
- 心情便签窗口无滚动条设计，提升界面简洁度

### 3. 应用程序
- **心情便签**：随机生成彩色爱情语录便签，支持创建多个，无滚动条设计，文本位于(`src\pages\Home.tsx`)
- **记事本**：支持输入标题和内容的简易记事本
- 其他常用应用图标（Finder、Safari、Mail、设置等），支持彩色图标显示

### 4. 用户体验优化
- 右键菜单支持更换壁纸
- 平滑的动画过渡效果
- 响应式设计
- 液态玻璃视觉效果（Glassmorphism）

## 🚀 项目启动方式

### 环境要求
- Node.js 16+
- pnpm 包管理器

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```
项目默认在 http://localhost:3000 启动开发服务器，如端口被占用会自动切换（如 http://localhost:3001）

### 构建生产版本
```bash
pnpm build
```
构建后的文件将输出到 `dist` 目录

## 🛠 技术栈
- React 18+
- TypeScript
- Vite 构建工具
- Tailwind CSS
- Framer Motion (动画效果)
- react-router-dom (路由)
- sonner (通知提示)

## 📁 项目结构
```
src/
├── App.tsx              # 应用主组件
├── assets/              # 静态资源
│   └── image/           # 图片资源（包含壁纸）
├── components/          # React组件
│   ├── Dock.tsx         # 底部应用栏（彩色图标）
│   ├── MenuBar.tsx      # 顶部菜单栏
│   ├── Window.tsx       # 窗口组件（含无滚动条配置）
│   ├── Empty.tsx        # 空状态组件
│   └── NameSettings.tsx # 名称设置组件
├── contexts/            # 上下文管理
│   └── authContext.ts   # 认证上下文
├── hooks/               # 自定义Hooks
│   └── useTheme.ts      # 主题切换钩子
├── lib/                 # 工具函数
│   └── utils.ts         # 通用工具
├── pages/               # 页面组件
│   └── Home.tsx         # 主页组件（含壁纸配置）
└── main.tsx             # 应用入口
```

## 💡 使用说明

### 壁纸设置
- 默认使用主题壁纸
- 右键点击桌面，可选择更换壁纸
- 预设壁纸存放在 `src/assets/image/wallpaper/` 目录

### 应用使用
- 点击Dock栏彩色图标打开对应应用
- 心情便签应用会随机生成浪漫语录便签
- 点击应用窗口标题栏可拖动窗口
- 窗口控制按钮提供最小化、最大化和关闭功能

### 主题设置
- 通过顶部菜单栏或主题切换按钮可切换深色/浅色主题
- 支持跟随系统主题自动切换
- 主题设置会保存到本地存储

## 📝 最近更新
- 优化Dock栏图标显示为彩色效果
- 隐藏心情便签窗口的滚动条，提升界面美观度
- 增强液态玻璃效果的视觉表现

## 🔧 配置文件
- `vite.config.ts` - Vite 构建配置
- `tailwind.config.js` - Tailwind CSS 配置
- `tsconfig.json` - TypeScript 配置

---
