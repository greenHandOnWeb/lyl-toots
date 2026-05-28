import ComparePanel from './features/compare/index.vue'
import { defineToolManifest } from '../core/defineToolManifest'

export default defineToolManifest({
  id: 'cheap-price',
  name: '比价',
  icon: '💰',
  desc: '多平台比价、历史价格与性价比推荐',
  keywords: ['比价', '淘宝', '京东', '拼多多', '唯品会', '价格', '历史'],
  version: '1.0.0',
  features: [
    {
      id: 'compare',
      name: '商品比价',
      component: ComparePanel,
      default: true,
    },
  ],
  plannedFeatures: [
    { id: 'api', name: '实时接口', desc: '对接各平台开放 API / 聚合服务' },
    { id: 'alert', name: '降价提醒', desc: '目标价到达通知' },
    { id: 'history', name: '收藏追踪', desc: '长期跟踪指定 SKU' },
  ],
  meta: {
    dataProvider: 'juhe',
    requiresProxy: true,
  },
})
