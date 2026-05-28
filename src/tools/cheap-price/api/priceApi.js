import { mapJuheToOffers } from './mapJuheOffers'
import { platformIdsToJuheSite } from '../utils/juheSites'
import { searchOffers as searchMockOffers } from '../utils/mockCatalog'

const DEFAULT_BASE =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_PRICE_API_BASE != null
    ? String(import.meta.env.VITE_PRICE_API_BASE).replace(/\/$/, '')
    : ''

export function isLivePriceEnabled() {
  if (import.meta.env?.VITE_PRICE_USE_MOCK === 'true') return false
  return import.meta.env?.VITE_PRICE_USE_LIVE !== 'false'
}

/**
 * @returns {Promise<{ offers: object[], dataSource: 'juhe'|'mock', message?: string }>}
 */
export async function fetchPriceOffers({ keyword, code, platformIds }) {
  const useLive = isLivePriceEnabled()
  const base = DEFAULT_BASE

  if (useLive) {
    try {
      const site = platformIdsToJuheSite(platformIds)
      const params = new URLSearchParams({
        keyword: keyword.trim(),
        code: code.trim(),
        site,
        pageSize: '30',
      })
      const url = `${base}/api/price/search?${params}`
      const res = await uni.request({ url, method: 'GET', timeout: 20000 })
      const status = res.statusCode ?? res.status
      const body = res.data

      if (status >= 400) {
        throw new Error(body?.reason || `请求失败 ${status}`)
      }

      if (body?.error_code === -1) {
        throw new Error('未配置比价服务：请启动 server/price-proxy 并设置 JUHE_API_KEY')
      }

      if (body?.error_code !== 0) {
        throw new Error(body?.reason || `接口错误 ${body?.error_code}`)
      }

      const mapped = mapJuheToOffers(body, {
        platformIds,
        keyword,
        code,
        source: body.source,
      })

      if (mapped.offers.length) {
        return { offers: mapped.offers, dataSource: 'juhe', message: mapped.message }
      }
    } catch (e) {
      const allowMock = import.meta.env?.VITE_PRICE_FALLBACK_MOCK === 'true'
      if (!allowMock) {
        throw e
      }
      console.warn('[cheap-price] 实时接口失败，回退演示数据:', e.message)
    }
  }

  const list = searchMockOffers({ keyword, code, platformIds })
  return {
    offers: list.map((o) => ({ ...o, dataSource: 'mock' })),
    dataSource: 'mock',
    message: useLive ? '实时数据不可用，已展示演示数据' : undefined,
  }
}

export async function checkPriceApiHealth() {
  const base = DEFAULT_BASE
  try {
    const res = await uni.request({
      url: `${base}/api/price/health`,
      method: 'GET',
      timeout: 5000,
    })
    const body = res.data
    return { ok: body?.ok, hasKey: body?.hasKey }
  } catch {
    return { ok: false, hasKey: false }
  }
}
