const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp)$/i

function isImageFile(file) {
  if (!file) return false
  if (file.type && file.type.startsWith('image/')) return true
  return IMAGE_EXT.test(file.name || '')
}

/**
 * H5：选择文件夹并筛选其中图片（webkitdirectory）
 * @param {number} maxCount 最多导入张数
 */
export function pickImageFolder(maxCount = 50) {
  // #ifdef H5
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.setAttribute('webkitdirectory', '')
    input.setAttribute('directory', '')
    input.multiple = true
    input.style.cssText = 'position:fixed;left:-9999px;opacity:0'

    const cleanup = () => {
      input.remove()
    }

    input.onchange = () => {
      const all = Array.from(input.files || [])
      const images = all.filter(isImageFile)
      cleanup()

      if (!images.length) {
        reject(new Error('文件夹内未找到图片'))
        return
      }

      const picked = images.slice(0, maxCount)
      if (images.length > maxCount) {
        uni.showToast({ title: `已导入前 ${maxCount} 张`, icon: 'none' })
      }

      resolve({
        paths: picked.map((f) => URL.createObjectURL(f)),
        tempFiles: picked.map((f) => ({
          name: f.name,
          size: f.size,
          path: f.webkitRelativePath || f.name,
        })),
      })
    }

    document.body.appendChild(input)
    input.click()

    // 部分浏览器取消选择不触发 onchange，由调用方 catch 忽略
    setTimeout(() => {
      if (document.body.contains(input)) cleanup()
    }, 60000)
  })
  // #endif

  // #ifndef H5
  return Promise.reject(new Error('文件夹上传仅支持 H5 网页版'))
  // #endif
}

export function isFolderPickSupported() {
  // #ifdef H5
  return true
  // #endif
  // #ifndef H5
  return false
  // #endif
}
