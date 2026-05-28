import { PLATFORMS } from './platforms'
import { buildPriceHistory } from './priceHistory'

/** 演示商品库（接入真实 API 后替换为接口数据） */
const CATALOG = [
  { name: 'Apple iPhone 15 128GB', code: 'IP15-128', base: 5199 },
  { name: 'Apple iPhone 15 Pro 256GB', code: 'IP15P-256', base: 7999 },
  { name: '小米14 16GB+512GB', code: 'MI14-512', base: 3999 },
  { name: '华为 Mate 60 Pro', code: 'MATE60P', base: 6499 },
  { name: '戴森 V12 吸尘器', code: 'DYSON-V12', base: 3299 },
  { name: '索尼 WH-1000XM5 耳机', code: 'SONY-XM5', base: 2299 },
  { name: '美的 空气炸锅 5L', code: 'MIDEA-AF5', base: 299 },
  { name: '李宁 跑步鞋 男款', code: 'LN-RUN-M', base: 259 },
  { name: '三只松鼠 坚果礼盒', code: '3S-NUT', base: 128 },
  { name: '农夫山泉 550ml*24瓶', code: 'NFSQ-24', base: 36 },
]

function relevance(query, code, item) {
  const q = query.toLowerCase()
  const text = `${item.name} ${item.code}`.toLowerCase()
  if (code && item.code.toLowerCase() === code.toLowerCase()) return 100
  if (!q) return 0
  if (text.includes(q)) return 80 + q.length
  const tokens = q.split(/\s+/).filter(Boolean)
  let hit = 0
  for (const t of tokens) {
    if (text.includes(t)) hit += 1
  }
  return hit > 0 ? hit * 25 : 0
}

function shopMeta(platformId, seed) {
  const trusts = { taobao: 7.5, jd: 9.2, pdd: 7.8, vip: 8.6 }
  const base = trusts[platformId] || 8
  return {
    shopTrust: Math.min(9.8, base + (seed % 5) * 0.15),
    rating: Math.round((4.3 + (seed % 8) * 0.08) * 10) / 10,
    reviewCount: 500 + seed * 137,
    sales: 1000 + seed * 421,
  }
}

/**
 * 模拟多平台比价搜索
 * @param {{ keyword: string, code?: string, platformIds?: string[] }} params
 */
export function searchOffers({ keyword, code = '', platformIds }) {
  const q = keyword.trim()
  if (!q && !code.trim()) return []

  const matched = CATALOG.map((item) => ({
    item,
    rel: Math.max(relevance(q, code, item), code ? relevance('', code, item) : 0),
  }))
    .filter((x) => x.rel > 0)
    .sort((a, b) => b.rel - a.rel)
    .slice(0, 3)

  if (!matched.length) {
    matched.push({
      item: { name: q || code, code: code || 'CUSTOM', base: 199 + Math.floor(Math.random() * 800) },
      rel: 50,
    })
  }

  const platforms = platformIds?.length
    ? PLATFORMS.filter((p) => platformIds.includes(p.id))
    : PLATFORMS

  const offers = []
  let seed = 0

  for (const { item } of matched) {
    for (const platform of platforms) {
      seed += 1
      const variance = [0.92, 0.96, 1, 1.04, 1.08, 0.88, 1.12][seed % 7]
      const factor = 0.98 + (platform.id === 'pdd' ? -0.06 : 0)
      const price = Math.round(item.base * variance * factor * 100) / 100
      const meta = shopMeta(platform.id, seed)
      const history = buildPriceHistory(price)

      offers.push({
        id: `${platform.id}-${item.code}-${seed}`,
        platformId: platform.id,
        title: `${item.name}（${platform.name}）`,
        sku: item.code,
        price,
        shopName: `${platform.name} · ${['旗舰店', '自营', '官方店', '品牌店'][seed % 4]}`,
        url: '',
        matchScore: matched[0].rel,
        ...meta,
        history,
      })
    }
  }

  offers.sort((a, b) => a.price - b.price)
  offers.forEach((o, i) => {
    o.priceRank = i
  })

  return offers
}
