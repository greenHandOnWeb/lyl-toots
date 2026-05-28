/**
 * 工具注册中心 —— 新增工具只需：
 * 1. 在 tools/<tool-id>/ 下创建 manifest.js、index.vue、features/、composables/
 * 2. 在本文件 import manifest 与 index，加入 TOOL_ENTRIES
 */
import { markRaw } from 'vue'

import imageCompressManifest from './image-compress/manifest'
import ImageCompressEntry from './image-compress/index.vue'
import jsonFormatterManifest from './json-formatter/manifest'
import JsonFormatterEntry from './json-formatter/index.vue'
import luckyWheelManifest from './lucky-wheel/manifest'
import LuckyWheelEntry from './lucky-wheel/index.vue'
import inspirationDiceManifest from './inspiration-dice/manifest'
import InspirationDiceEntry from './inspiration-dice/index.vue'
import cheapPriceManifest from './cheap-price/manifest'
import CheapPriceEntry from './cheap-price/index.vue'

/** manifest + 入口组件（解耦循环依赖） */
const TOOL_ENTRIES = [
  [imageCompressManifest, ImageCompressEntry],
  [jsonFormatterManifest, JsonFormatterEntry],
  [luckyWheelManifest, LuckyWheelEntry],
  [inspirationDiceManifest, InspirationDiceEntry],
  [cheapPriceManifest, CheapPriceEntry],
]

/** @type {import('./core/types').ToolManifest[]} */
const ALL_MANIFESTS = TOOL_ENTRIES.map(([manifest, entry]) => ({
  ...manifest,
  entry: markRaw(entry),
}))

const registryMap = new Map(ALL_MANIFESTS.map((m) => [m.id, m]))

/** 首页列表用：仅 listed 的工具 */
export function getToolList() {
  return ALL_MANIFESTS.filter((m) => m.listed).map((m) => ({
    id: m.id,
    name: m.name,
    icon: m.icon,
    desc: m.desc,
    keywords: m.keywords,
    version: m.version,
  }))
}

/** @param {string} id */
export function getToolById(id) {
  return registryMap.get(id) || null
}

/** 解析工具入口组件（detail 页动态挂载） */
export function resolveToolEntry(id) {
  const manifest = getToolById(id)
  if (!manifest?.entry) return null
  return manifest.entry
}

/** 搜索过滤 */
export function filterToolList(keyword) {
  const k = (keyword || '').trim().toLowerCase()
  const list = getToolList()
  if (!k) return list
  return list.filter(
    (t) =>
      t.name.toLowerCase().includes(k) ||
      t.desc.toLowerCase().includes(k) ||
      t.keywords.some((w) => w.toLowerCase().includes(k))
  )
}
