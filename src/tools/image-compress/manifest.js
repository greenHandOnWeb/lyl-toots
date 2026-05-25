import SingleCompressPanel from './features/single-compress/index.vue'
import BatchCompressPanel from './features/batch-compress/index.vue'
import { defineToolManifest } from '../core/defineToolManifest'

/**
 * 图片压缩工具清单
 */
export default defineToolManifest({
  id: 'image-compress',
  name: '图片压缩',
  icon: '🖼️',
  desc: '本地多格式图片压缩，支持单张/批量上传、压缩与下载',
  keywords: ['图片', '压缩', 'canvas', '批量', '下载'],
  version: '1.1.0',
  features: [
    {
      id: 'single',
      name: '单张压缩',
      component: SingleCompressPanel,
      default: true,
    },
    {
      id: 'batch',
      name: '批量压缩',
      component: BatchCompressPanel,
    },
  ],
  plannedFeatures: [
    { id: 'resize', name: '尺寸调整', desc: '按宽高上限缩放' },
    { id: 'format', name: '格式转换', desc: 'WebP / PNG / JPG 互转' },
  ],
  meta: {
    maxSide: 1200,
    defaultQuality: 80,
    maxBatch: 9,
    maxFolderImages: 50,
  },
})
