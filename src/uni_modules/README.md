# uni_modules

本项目 **uv-ui 已通过 pnpm 安装**（`@climblee/uv-ui`），easycom 见 `pages.json`，**无需**再向本目录手动拷贝 uv 组件。

若希望改用插件市场版（HBuilderX 导入），可：

1. 从 [uv-ui 插件市场](https://ext.dcloud.net.cn/plugin?id=12287) 下载并解压到 `src/uni_modules`
2. 将 `pages.json` 的 easycom 改回：`"@/uni_modules/uv-$1/components/uv-$1/uv-$1.vue"`
3. 移除 `package.json` 中的 `@climblee/uv-ui` 依赖
