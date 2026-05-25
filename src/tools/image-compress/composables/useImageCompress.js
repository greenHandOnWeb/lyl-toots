import { ref, computed } from 'vue'

/**
 * 图片压缩核心逻辑（与 UI 解耦，便于单张/批量等功能复用）
 * @param {{ maxSide?: number, canvasId?: string }} options
 */
export function useImageCompress(options = {}) {
  const maxSide = options.maxSide ?? 1200
  const canvasId = options.canvasId ?? 'compressCanvas'

  const previewSrc = ref('')
  const quality = ref(80)
  const compressing = ref(false)
  const canvasW = ref(300)
  const canvasH = ref(300)
  const sizeInfo = ref({ original: 0, compressed: 0 })

  const savePercent = computed(() => {
    const { original, compressed } = sizeInfo.value
    if (!original || !compressed) return 0
    return Math.round((1 - compressed / original) * 100)
  })

  function setQuality(val) {
    quality.value = val
  }

  function chooseImage(count = 1) {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const path = res.tempFilePaths[0]
          previewSrc.value = path
          sizeInfo.value = { original: 0, compressed: 0 }
          uni.getFileInfo({
            filePath: path,
            success: (info) => {
              sizeInfo.value.original = info.size
              resolve({ path, size: info.size, paths: res.tempFilePaths })
            },
            fail: () => resolve({ path, paths: res.tempFilePaths }),
          })
        },
        fail: reject,
      })
    })
  }

  function compress() {
    if (!previewSrc.value) return Promise.reject(new Error('未选择图片'))
    compressing.value = true
    return compressByCanvas()
  }

  // #ifdef APP-PLUS
  /** App 原生压缩，批量功能可优先调用 */
  function compressByNative() {
    return new Promise((resolve, reject) => {
      uni.compressImage({
        src: previewSrc.value,
        quality: quality.value,
        success: (res) => {
          previewSrc.value = res.tempFilePath
          uni.getFileInfo({
            filePath: res.tempFilePath,
            success: (info) => {
              sizeInfo.value.compressed = info.size
              compressing.value = false
              resolve(res.tempFilePath)
            },
            fail: () => {
              compressing.value = false
              reject(new Error('读取压缩结果失败'))
            },
          })
        },
        fail: (err) => {
          compressing.value = false
          reject(err)
        },
      })
    })
  }
  // #endif

  /** H5 / App 通用 Canvas 压缩 */
  function compressByCanvas() {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: previewSrc.value,
        success: (img) => {
          let drawW = img.width
          let drawH = img.height
          if (drawW > maxSide || drawH > maxSide) {
            const ratio = Math.min(maxSide / drawW, maxSide / drawH)
            drawW = Math.floor(drawW * ratio)
            drawH = Math.floor(drawH * ratio)
          }
          canvasW.value = drawW
          canvasH.value = drawH

          const ctx = uni.createCanvasContext(canvasId)
          ctx.drawImage(previewSrc.value, 0, 0, drawW, drawH)
          ctx.draw(false, () => {
            setTimeout(() => {
              uni.canvasToTempFilePath({
                canvasId,
                width: drawW,
                height: drawH,
                destWidth: drawW,
                destHeight: drawH,
                quality: quality.value / 100,
                fileType: 'jpg',
                success: (res) => {
                  previewSrc.value = res.tempFilePath
                  uni.getFileInfo({
                    filePath: res.tempFilePath,
                    success: (info) => {
                      sizeInfo.value.compressed = info.size
                      compressing.value = false
                      resolve(res.tempFilePath)
                    },
                    fail: () => {
                      compressing.value = false
                      reject(new Error('读取文件信息失败'))
                    },
                  })
                },
                fail: (err) => {
                  compressing.value = false
                  reject(err)
                },
              })
            }, 300)
          })
        },
        fail: (err) => {
          compressing.value = false
          reject(err)
        },
      })
    })
  }

  return {
    previewSrc,
    quality,
    compressing,
    canvasW,
    canvasH,
    sizeInfo,
    savePercent,
    setQuality,
    chooseImage,
    compress,
    compressByCanvas,
    // #ifdef APP-PLUS
    compressByNative,
    // #endif
  }
}
