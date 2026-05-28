/**
 * 比价 API 代理（隐藏 JUHE_API_KEY，解决 H5 跨域）
 * 文档：https://www.juhe.cn/docs/api/id/137
 *
 * 启动：JUHE_API_KEY=你的key node server/price-proxy.mjs
 */
import http from 'http'
import https from 'https'
import { URL, URLSearchParams } from 'url'

const PORT = Number(process.env.PRICE_PROXY_PORT || 8787)
const JUHE_KEY = process.env.JUHE_API_KEY || ''

const JUHE_MMB_COMPLEX = 'http://api2.juheapi.com/mmb/search/complex'
const JUHE_BARCODE = 'https://apis.juhe.cn/barcode/query'

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib
      .get(url, (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8')
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`))
            return
          }
          try {
            resolve(JSON.parse(body))
          } catch {
            reject(new Error('接口返回非 JSON'))
          }
        })
      })
      .on('error', reject)
  })
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(data))
}

async function searchJuhe({ keyword, code, site, pageSize }) {
  if (!JUHE_KEY) {
    return { error_code: -1, reason: '未配置 JUHE_API_KEY', result: null }
  }

  const q = keyword?.trim() || ''
  const barcode = code?.trim() || ''

  if (barcode && /^\d{8,14}$/.test(barcode)) {
    try {
      const params = new URLSearchParams({ key: JUHE_KEY, barcode })
      const data = await httpGet(`${JUHE_BARCODE}?${params}`)
      if (data.error_code === 0 && data.result) {
        return { error_code: 0, reason: 'success', result: data.result, source: 'barcode' }
      }
    } catch {
      /* 条码接口不可用时回退关键词搜索 */
    }
  }

  if (!q && !barcode) {
    return { error_code: 213701, reason: '关键字不能为空', result: null }
  }

  const params = new URLSearchParams({
    key: JUHE_KEY,
    keyword: q || barcode,
    Site: site || '0',
    PriceMin: '0',
    PriceMax: '0',
    PageNum: '1',
    PageSize: String(Math.min(50, pageSize || 30)),
    Orderby: '2',
    ZiYing: '0',
    ExtraParameter: '0',
  })

  const data = await httpGet(`${JUHE_MMB_COMPLEX}?${params}`)
  return { ...data, source: 'mmb' }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)

  if (url.pathname === '/api/price/health') {
    sendJson(res, 200, {
      ok: true,
      hasKey: Boolean(JUHE_KEY),
      port: PORT,
    })
    return
  }

  if (url.pathname === '/api/price/search' && req.method === 'GET') {
    try {
      const keyword = url.searchParams.get('keyword') || ''
      const code = url.searchParams.get('code') || ''
      const site = url.searchParams.get('site') || '0'
      const pageSize = Number(url.searchParams.get('pageSize') || 30)

      const data = await searchJuhe({ keyword, code, site, pageSize })
      sendJson(res, 200, data)
    } catch (e) {
      sendJson(res, 502, {
        error_code: -2,
        reason: e.message || '代理请求失败',
        result: null,
      })
    }
    return
  }

  sendJson(res, 404, { error_code: 404, reason: 'not found' })
})

server.listen(PORT, () => {
  console.log(`[price-proxy] http://127.0.0.1:${PORT}`)
  console.log(`[price-proxy] JUHE_API_KEY: ${JUHE_KEY ? '已配置' : '未配置（请设置环境变量）'}`)
})
