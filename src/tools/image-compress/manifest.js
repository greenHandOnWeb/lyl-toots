import SingleCompressPanel from './features/single-compress/index.vue'
import RoadmapPanel from './features/roadmap/index.vue'
import { defineToolManifest } from '../core/defineToolManifest'

/**
 * 图片压缩工具清单
 * 扩展方式：在 features 追加项，或把 plannedFeatures 中的模块实现后移入 features
 */
export default defineToolManifest({
  id: 'image-compress',
  name: '图片压缩',
  icon: '🖼️',
  desc: '前端 Canvas / 原生压缩，支持后续批量、尺寸裁剪等',
  keywords: ['图片', '压缩', 'canvas', '批量'],
  version: '1.0.0',
  features: [
    {
      id: 'single',
      name: '单张压缩',
      component: SingleCompressPanel,
      default: true,
    },
    {
      id: 'roadmap',
      name: '扩展规划',
      component: RoadmapPanel,
    },
    // 示例：批量功能预留，enabled: false 时不出现在 Tab
    // {
    //   id: 'batch',
    //   name: '批量压缩',
    //   component: BatchCompressPanel,
    //   enabled: false,
    // },
  ],
  plannedFeatures: [
    { id: 'batch', name: '批量压缩', desc: '多图队列压缩与导出' },
    { id: 'resize', name: '尺寸调整', desc: '按宽高上限缩放' },
    { id: 'format', name: '格式转换', desc: 'WebP / PNG / JPG 互转' },
  ],
  meta: {
    maxSide: 1200,
    defaultQuality: 80,
  },
})
