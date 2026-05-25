import SpinPanel from './features/spin/index.vue'
import { defineToolManifest } from '../core/defineToolManifest'

export default defineToolManifest({
  id: 'lucky-wheel',
  name: '随机转盘',
  icon: '🎡',
  desc: '决策转盘，可扩展自定义奖项、权重、历史记录',
  keywords: ['转盘', '抽奖', '随机', '决策'],
  version: '1.0.0',
  features: [
    {
      id: 'spin',
      name: '开始抽奖',
      component: SpinPanel,
      default: true,
    },
  ],
  plannedFeatures: [
    { id: 'custom', name: '自定义奖项', desc: '用户编辑扇区文案与颜色' },
    { id: 'weight', name: '权重抽奖', desc: '按概率分配扇区' },
    { id: 'history', name: '抽奖记录', desc: '本地存储历史结果' },
  ],
  meta: {
    defaultPrizes: ['吃火锅', '喝奶茶', '看电影', '打游戏', '早点睡', '写代码'],
  },
})
