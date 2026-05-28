import { PLATFORMS } from './platforms'

/** 百价网 / Juhe Site 编号（0=全部） */
export const JUHE_SITE_BY_PLATFORM = {
  jd: '1',
  taobao: '3',
  tmall: '2',
  pdd: '4',
  vip: '5',
}

/** 平台 id → 结果里商城名称关键词 */
const MALL_KEYWORDS = {
  taobao: ['淘宝', '天猫', 'tmall', 'taobao'],
  jd: ['京东', 'jd.com', 'JD'],
  pdd: ['拼多多', 'pdd'],
  vip: ['唯品会', 'vip'],
}

export function platformIdsToJuheSite(platformIds) {
  if (!platformIds?.length || platformIds.length === PLATFORMS.length) return '0'
  const first = platformIds[0]
  return JUHE_SITE_BY_PLATFORM[first] || '0'
}

export function matchPlatformByMallName(mallName, platformIds) {
  const name = String(mallName || '').toLowerCase()
  if (!name) return true
  if (!platformIds?.length) return true

  return platformIds.some((pid) => {
    const keys = MALL_KEYWORDS[pid] || []
    return keys.some((k) => name.includes(k.toLowerCase()))
  })
}

export function inferPlatformId(mallName) {
  const name = String(mallName || '').toLowerCase()
  if (name.includes('京东') || name.includes('jd')) return 'jd'
  if (name.includes('拼多多') || name.includes('pdd')) return 'pdd'
  if (name.includes('唯品') || name.includes('vip')) return 'vip'
  if (name.includes('淘宝') || name.includes('天猫') || name.includes('taobao')) return 'taobao'
  return 'other'
}
