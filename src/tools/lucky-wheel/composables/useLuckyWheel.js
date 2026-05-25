import { ref, onMounted } from 'vue'

const DEFAULT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

/**
 * 转盘绘制与旋转逻辑
 * @param {{ prizes: string[], canvasId?: string, canvasSize?: number }} options
 */
export function useLuckyWheel(options) {
  const prizes = options.prizes || []
  const canvasId = options.canvasId || 'wheelCanvas'
  const canvasSize = ref(options.canvasSize ?? 280)
  const rotateDeg = ref(0)
  const spinning = ref(false)
  const duration = ref(4000)
  const sectorAngle = 360 / (prizes.length || 1)

  function drawWheel() {
    const size = canvasSize.value
    const ctx = uni.createCanvasContext(canvasId)
    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 4

    prizes.forEach((label, i) => {
      const start = ((i * sectorAngle - 90) * Math.PI) / 180
      const end = (((i + 1) * sectorAngle - 90) * Math.PI) / 180
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.setFillStyle(DEFAULT_COLORS[i % DEFAULT_COLORS.length])
      ctx.fill()
      ctx.setFillStyle('#333')
      ctx.setFontSize(12)
      const mid = ((i + 0.5) * sectorAngle - 90) * (Math.PI / 180)
      const tx = cx + r * 0.55 * Math.cos(mid)
      const ty = cy + r * 0.55 * Math.sin(mid)
      ctx.save()
      ctx.translate(tx, ty)
      ctx.rotate(mid + Math.PI / 2)
      ctx.fillText(label, -24, 0)
      ctx.restore()
    })
    ctx.draw()
  }

  function spin() {
    if (spinning.value || !prizes.length) return Promise.resolve(null)
    spinning.value = true

    const winIndex = Math.floor(Math.random() * prizes.length)
    const base = 360 * (5 + Math.floor(Math.random() * 3))
    const offset = 360 - (winIndex * sectorAngle + sectorAngle / 2)
    const target = rotateDeg.value + base + offset - (rotateDeg.value % 360)

    duration.value = 3500 + Math.floor(Math.random() * 1500)
    rotateDeg.value = target

    return new Promise((resolve) => {
      setTimeout(() => {
        spinning.value = false
        resolve({ index: winIndex, label: prizes[winIndex] })
      }, duration.value + 100)
    })
  }

  function initDraw() {
    onMounted(() => {
      drawWheel()
    })
  }

  return {
    canvasSize,
    rotateDeg,
    spinning,
    duration,
    sectorAngle,
    drawWheel,
    spin,
    initDraw,
    prizes,
  }
}
