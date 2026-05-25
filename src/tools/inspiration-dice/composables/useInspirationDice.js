import { ref, computed, unref } from 'vue'

const FACE_ANGLES = [
  { x: 0, y: 0 },
  { x: 0, y: 180 },
  { x: 0, y: -90 },
  { x: 0, y: 90 },
  { x: -90, y: 0 },
  { x: 90, y: 0 },
]

/**
 * 3D 骰子旋转逻辑
 * @param {import('vue').MaybeRefOrGetter<string[]>} facesSource - 六个面的文案（支持响应式）
 */
export function useInspirationDice(facesSource = []) {
  const faces = computed(() => {
    const raw = typeof facesSource === 'function' ? facesSource() : unref(facesSource)
    return Array.isArray(raw) ? raw : []
  })
  const rotateX = ref(-20)
  const rotateY = ref(30)
  const isRolling = ref(false)
  const resultKeyword = ref('')

  const cubeStyle = computed(() => ({
    transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    transition: isRolling.value
      ? 'transform 1.8s cubic-bezier(0.2, 0.9, 0.3, 1)'
      : 'transform 0.3s ease',
  }))

  function roll() {
    const list = faces.value
    if (isRolling.value || list.length < 6) return Promise.resolve(null)
    isRolling.value = true
    resultKeyword.value = ''

    const faceIndex = Math.floor(Math.random() * 6)
    const target = FACE_ANGLES[faceIndex]
    const extraX = 360 * (3 + Math.floor(Math.random() * 3))
    const extraY = 360 * (3 + Math.floor(Math.random() * 3))

    rotateX.value = target.x + extraX
    rotateY.value = target.y + extraY

    return new Promise((resolve) => {
      setTimeout(() => {
        isRolling.value = false
        const keyword = list[faceIndex]
        resultKeyword.value = keyword
        resolve({ index: faceIndex, keyword })
      }, 1900)
    })
  }

  return {
    faces,
    rotateX,
    rotateY,
    isRolling,
    resultKeyword,
    cubeStyle,
    roll,
  }
}
