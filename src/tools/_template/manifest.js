import { defineToolManifest } from '../core/defineToolManifest'
// import SamplePanel from './features/sample/index.vue'

/** 复制本目录后修改 id，并在 registry.js 注册 */
export default defineToolManifest({
  id: 'your-tool-id',
  name: '工具名称',
  icon: '📦',
  desc: '一句话描述',
  keywords: ['关键词'],
  version: '0.1.0',
  features: [
    // {
    //   id: 'main',
    //   name: '主功能',
    //   component: SamplePanel,
    //   default: true,
    // },
  ],
  plannedFeatures: [],
  meta: {},
})
