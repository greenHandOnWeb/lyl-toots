/** 支持的电商平台 */
export const PLATFORMS = [
  { id: 'taobao', name: '淘宝', short: '淘' },
  { id: 'jd', name: '京东', short: '京' },
  { id: 'pdd', name: '拼多多', short: '拼' },
  { id: 'vip', name: '唯品会', short: '唯' },
]

export function getPlatform(id) {
  return PLATFORMS.find((p) => p.id === id) || { id, name: id, short: '?' }
}
