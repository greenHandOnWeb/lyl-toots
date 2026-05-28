function pick(obj, ...keys) {
  for (const k of keys) {
    const v = obj?.[k]
    if (v !== undefined && v !== null && v !== '') return v
  }
  return undefined
}

function toNum(v) {
  const n = Number(String(v).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function statsFromSeries(series, n) {
  const slice = series.slice(-n)
  const prices = slice.map((s) => s.price)
  if (!prices.length) return { low: 0, high: 0, avg: 0 }
  return {
    low: Math.min(...prices),
    high: Math.max(...prices),
    avg: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100,
  }
}

/**
 * 从第三方返回中解析历史价（有则用真实/半真实，无则返回 null）
 */
export function buildPriceHistoryFromQuote(item, currentPrice) {
  const low = toNum(pick(item, 'LowestPrice', 'lowest_price', 'history_low', 'min_price'))
  const high = toNum(pick(item, 'HighestPrice', 'highest_price', 'history_high', 'max_price'))
  const trend = item?.PriceTrend || item?.price_trend || item?.history || item?.History

  let series = []
  if (Array.isArray(trend)) {
    series = trend
      .map((p, i) => ({
        label: pick(p, 'label', 'month', 'date') || `${i + 1}`,
        price: toNum(pick(p, 'price', 'Price', 'value')) || currentPrice,
      }))
      .filter((p) => p.price > 0)
  }

  if (!series.length && low > 0 && high > 0) {
    const mid = Math.round(((low + high) / 2) * 100) / 100
    series = [
      { label: '低', price: low },
      { label: '均', price: mid },
      { label: '现', price: currentPrice },
      { label: '高', price: high },
    ]
  }

  if (series.length < 2) return null

  return {
    series,
    m3: statsFromSeries(series, 3),
    m6: statsFromSeries(series, 6),
    y1: statsFromSeries(series, 12),
    live: true,
    partial: series.length < 6,
  }
}

/**
 * 生成历史价格序列并统计近 3/6/12 月
 * @param {number} basePrice 当前价
 * @param {{ live?: boolean, partial?: boolean }} meta
 */
export function buildPriceHistory(basePrice, meta = {}) {
  const months = 12
  const series = []
  let price = basePrice * (0.92 + Math.random() * 0.12)
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    price = Math.max(basePrice * 0.75, price * (0.97 + Math.random() * 0.06))
    series.push({
      label: `${d.getMonth() + 1}月`,
      price: Math.round(price * 100) / 100,
    })
  }
  series[series.length - 1].price = basePrice

  const stats = (n) => {
    const slice = series.slice(-n)
    const prices = slice.map((s) => s.price)
    return {
      low: Math.min(...prices),
      high: Math.max(...prices),
      avg: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100,
    }
  }

  return {
    series,
    m3: stats(3),
    m6: stats(6),
    y1: stats(12),
    live: Boolean(meta.live),
    partial: Boolean(meta.partial),
  }
}
