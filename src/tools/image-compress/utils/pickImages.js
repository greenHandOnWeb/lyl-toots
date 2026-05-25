/**
 * 跨端选择本地图片（尽量覆盖常见格式）
 * H5：chooseFile；App/小程序：chooseImage
 * @param {number} count 最多选择张数，uni 上限一般为 9
 */
export function pickImages(count = 1) {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    uni.chooseFile({
      count,
      type: 'image',
      extension: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
      success: (res) => {
        const paths = (res.tempFilePaths || []).filter(Boolean)
        if (!paths.length) {
          reject(new Error('未选择图片'))
          return
        }
        resolve({ paths, tempFiles: res.tempFiles || [] })
      },
      fail: reject,
    })
    // #endif

    // #ifndef H5
    uni.chooseImage({
      count,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const paths = res.tempFilePaths || []
        if (!paths.length) {
          reject(new Error('未选择图片'))
          return
        }
        resolve({ paths, tempFiles: [] })
      },
      fail: reject,
    })
    // #endif
  })
}
