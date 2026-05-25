import { ref, computed } from 'vue'
import { pickImages } from '../utils/pickImages'
import { pickImageFolder } from '../utils/pickImageFolder'
import { calcSavePercent } from '../utils/calcSavePercent'
import { saveImageToLocal } from '../utils/saveImage'
import { downloadImagesToFolder } from '../utils/downloadBatchFolder'

function createItem(path, index, tempFiles = []) {
  const file = tempFiles[index]
  const baseName = file?.name
    ? file.name.replace(/\.[^.]+$/, '')
    : `image-${index + 1}`
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    name: baseName,
    path,
    originalSize: file?.size || 0,
    compressedPath: '',
    compressedSize: 0,
    savePercent: 0,
    status: 'pending',
    error: '',
    downloadName: `${baseName}_compressed.jpg`,
  }
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

async function fillOriginalSize(item) {
  if (item.originalSize > 0) return
  item.originalSize = await readFileSize(item.path)
}

/**
 * 批量图片压缩
 * @param {{ maxSide?: number, canvasId?: string, defaultQuality?: number, maxBatch?: number, maxFolderImages?: number }} options
 */
export function useImageBatchCompress(options = {}) {
  const maxSide = options.maxSide ?? 1200
  const canvasId = options.canvasId ?? 'compressCanvasBatch'
  const maxBatch = options.maxBatch ?? 9
  const maxFolderImages = options.maxFolderImages ?? 50
  const quality = ref(options.defaultQuality ?? 80)
  const items = ref([])
  const compressing = ref(false)
  const downloading = ref(false)
  const canvasW = ref(300)
  const canvasH = ref(300)

  const doneCount = computed(() => items.value.filter((i) => i.status === 'done').length)
  const canCompress = computed(
    () => items.value.length > 0 && !compressing.value && items.value.some((i) => i.status !== 'done')
  )
  const canDownloadAll = computed(
    () => !downloading.value && items.value.some((i) => i.status === 'done' && i.compressedPath)
  )

  const batchSummary = computed(() => {
    const done = items.value.filter((i) => i.status === 'done' && i.compressedSize > 0)
    if (!done.length) return null
    const original = done.reduce((s, i) => s + i.originalSize, 0)
    const compressed = done.reduce((s, i) => s + i.compressedSize, 0)
    return {
      count: done.length,
      original,
      compressed,
      savePercent: calcSavePercent(original, compressed),
    }
  })

  function setQuality(val) {
    quality.value = val
  }

  async function appendItems(paths, tempFiles = []) {
    const startIndex = items.value.length
    const added = paths.map((path, i) => createItem(path, startIndex + i, tempFiles))
    for (const item of added) {
      await fillOriginalSize(item)
    }
    items.value = [...items.value, ...added]
    return added.length
  }

  async function addImages() {
    const remain = maxBatch - items.value.length
    if (remain <= 0) {
      uni.showToast({ title: `最多 ${maxBatch} 张`, icon: 'none' })
      return
    }
    const { paths, tempFiles } = await pickImages(remain)
    const n = await appendItems(paths, tempFiles)
    uni.showToast({ title: `已添加 ${n} 张`, icon: 'none' })
  }

  async function addFromFolder() {
    const remain = maxFolderImages - items.value.length
    if (remain <= 0) {
      uni.showToast({ title: `最多 ${maxFolderImages} 张`, icon: 'none' })
      return
    }
    const { paths, tempFiles } = await pickImageFolder(remain)
    const n = await appendItems(paths, tempFiles)
    uni.showToast({ title: `已从文件夹导入 ${n} 张`, icon: 'success' })
  }

  function removeItem(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clearAll() {
    items.value = []
  }

  function compressOne(item) {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: item.path,
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
          ctx.drawImage(item.path, 0, 0, drawW, drawH)
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
                  item.compressedPath = res.tempFilePath
                  item.compressedSize = await readFileSize(res.tempFilePath)
                  item.savePercent = calcSavePercent(item.originalSize, item.compressedSize)
                  item.status = 'done'
                  item.error = ''
                  resolve(res.tempFilePath)
                },
                fail: (err) => {
                  item.status = 'error'
                  item.error = err?.errMsg || '压缩失败'
                  reject(err)
                },
              })
            }, 300)
          })
        },
        fail: (err) => {
          item.status = 'error'
          item.error = err?.errMsg || '无法读取图片'
          reject(err)
        },
      })
    })
  }

  async function compressAll() {
    if (!items.value.length) return
    compressing.value = true
    let failCount = 0
    for (const item of items.value) {
      if (item.status === 'done') continue
      item.status = 'compressing'
      try {
        await compressOne(item)
      } catch {
        failCount += 1
      }
    }
    compressing.value = false
    const ok = doneCount.value
    const pct = batchSummary.value?.savePercent
    if (failCount > 0) {
      uni.showToast({ title: `完成 ${ok} 张，失败 ${failCount} 张`, icon: 'none' })
    } else if (pct > 0) {
      uni.showToast({ title: `压缩效果 ${pct}%`, icon: 'success' })
    } else {
      uni.showToast({ title: `已压缩 ${ok} 张`, icon: 'success' })
    }
  }

  async function downloadAll() {
    const list = items.value.filter((i) => i.status === 'done' && i.compressedPath)
    if (!list.length) {
      uni.showToast({ title: '请先批量压缩', icon: 'none' })
      return
    }
    downloading.value = true
    try {
      const result = await downloadImagesToFolder(
        list.map((i) => ({ path: i.compressedPath, filename: i.downloadName }))
      )
      if (result.mode === 'zip') {
        uni.showToast({ title: `已下载 ${result.folderName}.zip`, icon: 'success' })
      } else if (result.mode === 'folder') {
        uni.showModal({
          title: '已保存到文件夹',
          content: `${result.folderName}\n路径：${result.path || ''}`,
          showCancel: false,
        })
      } else {
        uni.showToast({ title: '已保存到相册', icon: 'success' })
      }
    } catch {
      uni.showToast({ title: '下载失败', icon: 'none' })
    } finally {
      downloading.value = false
    }
  }

  async function downloadOne(item) {
    if (!item.compressedPath) {
      uni.showToast({ title: '请先压缩该图片', icon: 'none' })
      return
    }
    try {
      await saveImageToLocal(item.compressedPath, item.downloadName)
      uni.showToast({ title: '已保存', icon: 'success' })
    } catch {
      uni.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  return {
    items,
    quality,
    compressing,
    downloading,
    canvasW,
    canvasH,
    doneCount,
    batchSummary,
    canCompress,
    canDownloadAll,
    maxFolderImages,
    setQuality,
    addImages,
    addFromFolder,
    removeItem,
    clearAll,
    compressAll,
    downloadAll,
    downloadOne,
  }
}
