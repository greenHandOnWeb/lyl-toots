import { getPlatform } from '../utils/platforms'
import { inferPlatformId, matchPlatformByMallName } from '../utils/juheSites'
import { buildPriceHistoryFromQuote } from '../utils/priceHistory'

function pick(obj, ...keys) {
  for (const k of keys) {
    const v = obj?.[k]
    if (v !== undefined && v !== null && v !== '') return v
  }
  return undefined
}

function toNumber(v) {
  const n = Number(String(v).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function extractList(result) {
  if (!result) return []
  if (Array.isArray(result)) return result
  for (const key of ['list', 'rows', 'data', 'items', 'products', 'Offers', 'offers']) {
    if (Array.isArray(result[key])) return result[key]
  }
  if (result.price || result.Price || result.title || result.Title) return [result]
  return []
}

/** 条码接口 result → 多商城报价列表 */
function extractBarcodePrices(result) {
  const rows = []
  const name = pick(result, 'goodsname', 'goodsName', 'name', 'title')
  const prices = result?.price || result?.prices || result?.PriceList || result?.price_list
  if (Array.isArray(prices)) {
    for (const p of prices) {
      rows.push({
        Title: name || pick(p, 'name', 'title'),
        Price: pick(p, 'price', 'Price', 'nowprice'),
        Mall: pick(p, 'store', 'mall', 'site', 'shop', 'Mall'),
        ShopName: pick(p, 'shop', 'shopname', 'ShopName'),
        Url: pick(p, 'url', 'link', 'Url'),
        Rating: pick(p, 'rating', 'score'),
        ReviewCount: pick(p, 'comment', 'reviews'),
      })
    }
  }
  if (!rows.length && name) {
    rows.push({
      Title: name,
      Price: pick(result, 'price', 'Price', 'minprice'),
      Mall: pick(result, 'store', 'mall'),
      Url: pick(result, 'url', 'link'),
    })
  }
  return rows
}

/**
 * 将 Juhe / 百价网原始数据规范为比价 offer
 */
export function mapJuheToOffers(raw, { platformIds, keyword, code, source }) {
  let list = extractList(raw?.result)
  if (source === 'barcode' && raw?.result) {
    list = extractBarcodePrices(raw.result)
  }
  if (!list.length) return { offers: [], message: raw?.reason || '未找到商品' }

  const offers = []
  let idx = 0

  for (const item of list) {
    const mall = pick(item, 'Mall', 'mall', 'SiteName', 'site', 'store', 'shop_type')
    if (!matchPlatformByMallName(mall, platformIds)) continue

    const price = toNumber(pick(item, 'Price', 'price', 'NowPrice', 'nowprice', 'coupon_price'))
    if (price <= 0) continue

    const platformId = inferPlatformId(mall)
    const platform = getPlatform(platformId === 'other' ? 'taobao' : platformId)
    const title = pick(item, 'Title', 'title', 'goodsname', 'name') || keyword
    const shopName = pick(item, 'ShopName', 'shopname', 'shop', 'seller') || `${platform.name}商家`
    const rating = toNumber(pick(item, 'Rating', 'rating', 'Score', 'score')) || 4.5
    const reviewCount = toNumber(pick(item, 'ReviewCount', 'comment', 'comments', 'reviews')) || 0
    const sales = toNumber(pick(item, 'Sales', 'sales', 'sell', 'volume')) || 0
    const url = pick(item, 'Url', 'url', 'link', 'SpUrl', 'spurl') || ''
    const ziYing = pick(item, 'ZiYing', 'ziying', 'isSelf')
    const shopTrust = ziYing === 1 || ziYing === '1' || String(ziYing).includes('自营') ? 9.2 : 8.0

    const history = buildPriceHistoryFromQuote(item, price)

    idx += 1
    offers.push({
      id: `juhe-${platformId}-${idx}-${price}`,
      platformId: platformId === 'other' ? 'taobao' : platformId,
      title: String(title),
      sku: code || pick(item, 'Sku', 'sku', 'barcode') || '',
      price,
      shopName: String(shopName),
      url: String(url),
      matchScore: 80,
      shopTrust,
      rating: rating > 5 ? rating / 2 : rating,
      reviewCount: reviewCount || 100,
      sales: sales || 500,
      history,
      dataSource: 'juhe',
    })
  }

  offers.sort((a, b) => a.price - b.price)
  offers.forEach((o, i) => {
    o.priceRank = i
  })

  return {
    offers,
    message: offers.length ? '' : '未匹配到所选平台的报价',
    apiSource: raw?.source || 'mmb',
  }
}
