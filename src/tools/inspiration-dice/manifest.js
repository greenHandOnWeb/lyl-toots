import RollPanel from './features/roll/index.vue'
import { defineToolManifest } from '../core/defineToolManifest'

export default defineToolManifest({
  id: 'inspiration-dice',
  name: '灵感骰子',
  icon: '🎲',
  desc: '3D 骰子投掷创意关键词，可扩展词库、收藏',
  keywords: ['骰子', '灵感', '创意', 'AI'],
  version: '1.0.0',
  features: [
    {
      id: 'roll',
      name: '投掷',
      component: RollPanel,
      default: true,
    },
  ],
  plannedFeatures: [
    { id: 'library', name: '词库管理', desc: '自定义六面关键词' },
    { id: 'combo', name: '组合灵感', desc: '多骰组合生成 prompt' },
    { id: 'favorite', name: '收藏', desc: '收藏历史投掷结果' },
  ],
  meta: {
    defaultFaces: ['科幻', '复古', '极简', '赛博', '手绘', '蒸汽波'],
  },
})
