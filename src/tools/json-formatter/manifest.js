import EditorPanel from './features/editor/index.vue'
import { defineToolManifest } from '../core/defineToolManifest'

export default defineToolManifest({
  id: 'json-formatter',
  name: 'JSON 格式化',
  icon: '{ }',
  desc: '格式化、压缩、高亮；可扩展校验、转 XML 等',
  keywords: ['json', '格式化', '压缩', '校验'],
  version: '1.0.0',
  features: [
    {
      id: 'editor',
      name: '编辑器',
      component: EditorPanel,
      default: true,
    },
  ],
  plannedFeatures: [
    { id: 'validate', name: 'Schema 校验', desc: 'JSON Schema 校验' },
    { id: 'convert', name: '格式转换', desc: 'JSON ↔ YAML / XML' },
    { id: 'diff', name: '对比', desc: '两份 JSON diff' },
  ],
})
