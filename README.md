# 前端极客工具箱

基于 **uni-app + Vue 3（`<script setup>`）+ uv-ui + Vite** 的跨端工具应用，一套代码可打包 **H5** 与 **iOS/Android App**。

## 功能

| 工具 | 说明 |
|------|------|
| 图片压缩 | 选择图片、质量滑块、Canvas 压缩与体积对比 |
| JSON 格式化 | 格式化 / 压缩 / 复制，语法高亮展示 |
| 随机转盘 | Canvas 六扇区 + CSS 旋转动画 |
| 灵感骰子 | CSS 3D 立方体随机投掷关键词 |

## 目录结构

```
lyl-tools/
├── src/                    # uni-app 源码（CLI 默认目录）
│   ├── pages/
│   ├── tools/              # 可扩展工具插件（registry、各工具模块）
│   ├── components/
│   ├── static/
│   ├── uni_modules/        # uv-ui
│   ├── App.vue
│   ├── main.js
│   ├── pages.json
│   └── manifest.json
├── vite.config.js
└── package.json
```

**扩展说明**：见 [src/tools/README.md](./src/tools/README.md)

## 在 VS Code 中运行（推荐 CLI 方式）

**可以，不必只用 HBuilderX。** 本项目是 **uni-app CLI + Vite** 工程，用 VS Code 写代码、用终端跑命令即可。

### 环境要求

- **Node.js 18+**（Vue3/Vite 版要求，你本机可用 `node -v` 检查）
- **pnpm 9+**（`npm install -g pnpm` 或 `corepack enable` 后使用 `corepack prepare`）
- VS Code 插件（可选）：[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)、[uni-helper](https://uni-helper.js.org/)

### 第一次运行

在项目根目录打开终端（VS Code：`终端 → 新建终端`）：

```bash
# 0. 若未安装 pnpm（二选一）
npm install -g pnpm
# 或：corepack enable && corepack prepare pnpm@9.15.9 --activate

# 1. 安装依赖（已配置国内镜像与 hoist，见 .npmrc）
pnpm install

# 2. 若安装后提示 uni 找不到，对齐 @dcloudio 版本：
pnpm run sync:uni
pnpm install

# 3. 确认 CLI 是否就绪
pnpm run check:uni

# 4. 启动 H5（浏览器调试）
pnpm run dev:h5
```

终端会输出本地地址（一般为 `http://localhost:5173`），用浏览器打开即可。

### VS Code 快捷运行

- `Ctrl+Shift+P` → **Tasks: Run Task** → 选 **uni-app: 运行 H5**
- 或直接在终端执行 `pnpm run dev:h5`

### 和 HBuilderX 的分工

| 场景 | VS Code (CLI) | HBuilderX |
|------|----------------|-------------|
| H5 开发调试 | ✅ `pnpm run dev:h5` | ✅ 也可 |
| 微信小程序 | ✅ `pnpm run dev:mp-weixin` + 微信开发者工具 | ✅ |
| App 真机运行 / 云打包 apk | ⚠️ CLI 仅便于生成 wgt 等；真机调试、云打包常用 HBuilderX | ✅ 更省事 |
| 从插件市场导入 uv-ui | 下载插件 zip 解压到 `uni_modules` 即可 | ✅ 一键导入 |

总结：**日常 H5 / 小程序开发可以完全在 VS Code 完成**；App 真机若 CLI 配置麻烦，可继续用 HBuilderX 运行，两边改同一份代码互不影响。

### 安装 uv-ui（必需）

本项目已通过 **pnpm 依赖** 安装（`@climblee/uv-ui`），执行 `pnpm install` 即可，无需手动拷贝 `uni_modules`。

若 `pnpm install` 后仍报找不到 `uv-search` 等组件：

```bash
# 先停止 dev 服务（Ctrl+C），再重装
pnpm install
pnpm run dev:h5
```

也可改用插件市场：下载 uv-ui 解压到 `src/uni_modules`，并把 `pages.json` easycom 改回 `@/uni_modules/uv-$1/...`（见 `src/uni_modules/README.md`）。

### 常见问题

**`'uni' 不是内部或外部命令`**

- 说明 `@dcloudio/vite-plugin-uni` 未装完整，执行：`pnpm run sync:uni` → `pnpm install` → `pnpm run check:uni`
- 务必在项目根目录执行，且存在 `node_modules/@dcloudio/vite-plugin-uni/bin/uni.js`
- 若从 npm 切换过来，请先删除 `node_modules` 与 `package-lock.json`，再执行 `pnpm install`

**依赖版本对不齐**

- 所有 `@dcloudio/*` 版本号必须一致，用 `pnpm run sync:uni` 自动对齐官方 alpha 版本。

### 3. TabBar 图标

`src/static/tab/` 下已包含占位 PNG。可替换为 81×81 像素的 `home.png`、`home-active.png`、`mine.png`、`mine-active.png`。

## 工具 ID（首页跳转参数）

- `image-compress` — 图片压缩
- `json-formatter` — JSON 格式化
- `lucky-wheel` — 随机转盘
- `inspiration-dice` — 灵感骰子

## 条件编译说明

- `App.vue`：`#ifdef APP-PLUS` 申请相册/相机权限
- 首页：`#ifdef H5` 网页分享 / `#ifdef APP-PLUS` 原生 `uni.share`
- `ImageCompress.vue`：注释说明 H5 Canvas 与 App `uni.compressImage` 可选方案

## 技术规范

- 样式单位统一 **rpx**
- 路由使用 **uni.navigateTo** / **uni.switchTab**
- 组合式 API：**`<script setup>`**
