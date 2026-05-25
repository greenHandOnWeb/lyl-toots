/**
 * 规范化工具清单，供 registry 与 ToolShell 使用
 * @param {import('./types').ToolManifestInput} input
 * @returns {import('./types').ToolManifest}
 */
export function defineToolManifest(input) {
  const features = (input.features || [])
    .filter((f) => f.enabled !== false)
    .map((f, index) => ({
      ...f,
      default: f.default ?? index === 0,
    }))

  const defaultFeature =
    features.find((f) => f.default) || features[0] || null

  return {
    id: input.id,
    name: input.name,
    icon: input.icon || '📦',
    desc: input.desc || '',
    keywords: input.keywords || [],
    version: input.version || '1.0.0',
    /** 是否在首页列表展示 */
    listed: input.listed !== false,
    /** 工具入口页（index.vue） */
    entry: input.entry,
    /** 子功能模块列表 */
    features,
    defaultFeatureId: defaultFeature?.id || '',
    /**
     * 规划中、尚未启用的功能（仅文档/开发参考，不参与渲染）
     * 上线时移到 features 并设置 component
     */
    plannedFeatures: input.plannedFeatures || [],
    /** 工具级扩展元数据，子模块可通过 inject 读取 */
    meta: input.meta || {},
  }
}
