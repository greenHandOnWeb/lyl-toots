/**
 * 保存/下载单张图片到本地
 * @param {string} filePath 临时路径或 blob URL
 * @param {string} [filename] 建议文件名
 */
export function saveImageToLocal(filePath, filename = 'compressed.jpg') {
  if (!filePath) {
    return Promise.reject(new Error('无效的图片路径'))
  }

  return new Promise((resolve, reject) => {
    // #ifdef H5
    try {
      const link = document.createElement('a')
      link.href = filePath
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      resolve()
    } catch (e) {
      reject(e)
    }
    // #endif

    // #ifdef APP-PLUS
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => resolve(),
      fail: (err) => reject(err),
    })
    // #endif

    // #ifdef MP
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => resolve(),
      fail: (err) => reject(err),
    })
    // #endif
  })
}

/**
 * 顺序保存多张图片（避免 H5 同时触发多次下载被拦截）
 * @param {{ path: string, filename?: string }[]} items
 * @param {number} [delayMs]
 */
export async function saveImagesBatch(items, delayMs = 400) {
  const list = items.filter((i) => i?.path)
  for (let i = 0; i < list.length; i++) {
    await saveImageToLocal(list[i].path, list[i].filename || `image-${i + 1}.jpg`)
    if (i < list.length - 1 && delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
}
