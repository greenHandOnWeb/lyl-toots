import { ref, computed } from 'vue'
import { pickImages } from '../utils/pickImages'
import { calcSavePercent } from '../utils/calcSavePercent'
import { saveImageToLocal } from '../utils/saveImage'

/**
 * 图片压缩核心逻辑（单张）
 * H5：Canvas；App：也可 uni.compressImage，当前统一走 Canvas 保证体积对比一致
 * @param {{ maxSide?: number, canvasId?: string }} options
 */
export function useImageCompress(options = {}) {
  const maxSide = options.maxSide ?? 1200
  const canvasId = options.canvasId ?? 'compressCanvas'

  const previewSrc = ref('')
  const compressedSrc = ref('')
  const quality = ref(80)
  const compressing = ref(false)
  const canvasW = ref(300)
  const canvasH = ref(300)
  const sizeInfo = ref({ original: 0, compressed: 0 })
  const originalName = ref('compressed.jpg')

  const savePercent = computed(() =>
    calcSavePercent(sizeInfo.value.original, sizeInfo.value.compressed)
  )

  const canDownload = computed(() => !!compressedSrc.value && sizeInfo.value.compressed > 0)

  function setQuality(val) {
    quality.value = val
  }

  function readFileSize(filePath) {
    return new Promise((resolve) => {
      uni.getFileInfo({
        filePath,
        success: (info) => resolve(info.size || 0),
        fail: () => resolve(0),
      })
    })
  }

  async function chooseImage(count = 1) {
    const { paths, tempFiles } = await pickImages(count)
    const path = paths[0]
    previewSrc.value = path
    compressedSrc.value = ''
    const file = tempFiles?.[0]
    const original = file?.size || (await readFileSize(path))
    sizeInfo.value = { original, compressed: 0 }
    if (file?.name) {
      originalName.value = file.name.replace(/\.[^.]+$/, '') + '_compressed.jpg'
    } else {
      originalName.value = 'compressed.jpg'
    }
    return { path, size: original, paths }
  }

  function compress() {
    if (!previewSrc.value) return Promise.reject(new Error('未选择图片'))
    compressing.value = true
    return compressByCanvas(previewSrc.value)
  }

  /** 对指定路径执行 Canvas 压缩，返回压缩后临时路径 */
  function compressByCanvas(src) {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src,
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
          ctx.drawImage(src, 0, 0, drawW, drawH)
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
                success: async (res) => {
                  const outPath = res.tempFilePath
                  compressedSrc.value = outPath
                  previewSrc.value = outPath
                  const compressed = await readFileSize(outPath)
                  sizeInfo.value = { ...sizeInfo.value, compressed }
                  compressing.value = false
                  resolve(outPath)
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

  async function downloadCompressed() {
    if (!canDownload.value) {
      return Promise.reject(new Error('请先完成压缩'))
    }
    await saveImageToLocal(compressedSrc.value, originalName.value)
  }

  return {
    previewSrc,
    compressedSrc,
    quality,
    compressing,
    canvasW,
    canvasH,
    sizeInfo,
    savePercent,
    canDownload,
    originalName,
    setQuality,
    chooseImage,
    compress,
    compressByCanvas,
    downloadCompressed,
  }
}
