import { ref } from 'vue'

/**
 * JSON 处理逻辑，供 editor / diff 等多功能复用
 */
export function useJsonFormatter() {
  const inputText = ref('')
  const highlightHtml = ref('')
  const lastPlain = ref('')

  function parseInput() {
    const raw = inputText.value.trim()
    if (!raw) {
      uni.showToast({ title: '请输入 JSON', icon: 'none' })
      return null
    }
    try {
      return JSON.parse(raw)
    } catch (e) {
      uni.showToast({
        title: 'JSON 格式错误：' + (e.message || '解析失败'),
        icon: 'none',
        duration: 2500,
      })
      return null
    }
  }

  function format() {
    const data = parseInput()
    if (data === null) return
    const formatted = JSON.stringify(data, null, 2)
    lastPlain.value = formatted
    highlightHtml.value = buildHighlightHtml(formatted)
  }

  function minify() {
    const data = parseInput()
    if (data === null) return
    const minified = JSON.stringify(data)
    lastPlain.value = minified
    highlightHtml.value = buildHighlightHtml(minified)
  }

  function copy() {
    const text = lastPlain.value || inputText.value
    if (!text) {
      uni.showToast({ title: '暂无内容可复制', icon: 'none' })
      return
    }
    uni.setClipboardData({
      data: text,
      success: () => uni.showToast({ title: '已复制', icon: 'success' }),
    })
  }

  return {
    inputText,
    highlightHtml,
    lastPlain,
    format,
    minify,
    copy,
  }
}

/** 语法高亮 HTML */
export function buildHighlightHtml(jsonStr) {
  const escaped = jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const colored = escaped.replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
    (match, _q, colon) => {
      if (colon !== undefined) {
        return `<span style="color:#047857;font-weight:600">${match}</span>`
      }
      if (/^"/.test(match)) {
        return `<span style="color:#19be6b">${match}</span>`
      }
      if (/^(true|false|null)$/.test(match)) {
        return `<span style="color:#9c27b0">${match}</span>`
      }
      return `<span style="color:#ff9800">${match}</span>`
    }
  )

  return `<pre style="font-size:24rpx;line-height:1.6;white-space:pre-wrap;word-break:break-all;font-family:monospace;margin:0">${colored}</pre>`
}
