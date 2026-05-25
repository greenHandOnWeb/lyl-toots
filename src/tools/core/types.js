/**
 * @typedef {Object} ToolFeatureInput
 * @property {string} id - 功能唯一 ID，如 single / batch
 * @property {string} name - Tab 上显示的名称
 * @property {import('vue').Component} component - 功能面板组件
 * @property {boolean} [default] - 是否默认选中
 * @property {boolean} [enabled=false] - 为 false 时不注册到 Tab（用于预留）
 * @property {string} [icon] - 可选图标
 * @property {Record<string, unknown>} [meta] - 功能级扩展配置
 */

/**
 * @typedef {Object} ToolManifestInput
 * @property {string} id
 * @property {string} name
 * @property {string} [icon]
 * @property {string} [desc]
 * @property {string[]} [keywords]
 * @property {string} [version]
 * @property {boolean} [listed]
 * @property {import('vue').Component} entry - 工具入口组件（通常 index.vue）
 * @property {ToolFeatureInput[]} [features]
 * @property {{ id: string, name: string, desc?: string }[]} [plannedFeatures]
 * @property {Record<string, unknown>} [meta]
 */

/**
 * @typedef {Object} ToolManifest
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {string} desc
 * @property {string[]} keywords
 * @property {string} version
 * @property {boolean} listed
 * @property {import('vue').Component} entry
 * @property {ToolFeatureInput[]} features
 * @property {string} defaultFeatureId
 * @property {{ id: string, name: string, desc?: string }[]} plannedFeatures
 * @property {Record<string, unknown>} meta
 */

/**
 * @typedef {Object} ToolContext
 * @property {string} toolId
 * @property {ToolManifest} manifest
 * @property {import('vue').Ref<string>} activeFeatureId
 * @property {(id: string) => void} switchFeature
 */

export {}
