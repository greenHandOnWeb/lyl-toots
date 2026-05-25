# 工具模块扩展指南

每个工具是**独立插件包**，不是单一页面。推荐目录：

```
tools/<tool-id>/
├── manifest.js          # 工具元数据 + features 注册（勿 import index.vue）
├── index.vue            # 入口壳：ToolShell + props.manifest
├── composables/         # 可复用逻辑（跨子功能共享）
├── features/            # 子功能面板（Tab 切换）
│   └── <feature-id>/
│       └── index.vue
└── components/          # 仅本工具使用的 UI 碎片（可选）
```

## 新增一个工具（4 步）

1. 复制 `tools/_template/`（或参考 `image-compress/`）并重命名目录。
2. 编写 `manifest.js`，使用 `defineToolManifest({ id, name, features, ... })`。
3. 在 `tools/registry.js` 的 `TOOL_ENTRIES` 追加 `[manifest, Entry]`。
4. 完成。首页列表与详情路由会自动生效。

## 为已有工具增加子功能

1. 在 `features/<新功能id>/index.vue` 实现面板。
2. 在 `manifest.js` 的 `features` 数组追加一项：

```js
{
  id: 'batch',
  name: '批量压缩',
  component: BatchPanel,
  default: false,
}
```

3. 多个 `features` 时，`ToolShell` 会自动显示 Tab；仅 1 个时不显示 Tab。
4. 从首页直达某子功能：`/pages/tool/detail?id=image-compress&feature=batch`

## 逻辑与 UI 分离

- **UI** 放在 `features/**/index.vue`
- **逻辑** 放在 `composables/useXxx.js`，供多个 feature 复用
- 子面板内通过 `useToolContext()` 读取 `manifest`、`switchFeature(id)`

## plannedFeatures

`manifest.plannedFeatures` 仅作文档/排期，不参与渲染。功能就绪后移入 `features` 即可。

## 共享能力

- `tools/core/utils/` — 跨工具工具函数
- `components/tool-shell/ToolShell.vue` — 统一壳（标题、Tab、inject 上下文）
