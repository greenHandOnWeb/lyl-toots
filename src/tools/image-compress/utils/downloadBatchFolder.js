import { saveImagesBatch } from './saveImage'

function timestampFolderName(prefix = 'compressed-images') {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

function uniqueFilename(name, used) {
  if (!used.has(name)) {
    used.add(name)
    return name
  }
  const dot = name.lastIndexOf('.')
  const base = dot > 0 ? name.slice(0, dot) : name
  const ext = dot > 0 ? name.slice(dot) : '.jpg'
  let i = 2
  let next = `${base}_${i}${ext}`
  while (used.has(next)) {
    i += 1
    next = `${base}_${i}${ext}`
  }
  used.add(next)
  return next
}

async function pathToBlob(filePath) {
  const res = await fetch(filePath)
  if (!res.ok) throw new Error('读取图片失败')
  return res.blob()
}

/**
 * H5：将多张图片打包为 ZIP（解压后为同一文件夹）
 */
async function downloadAsZipFolder(items, folderName) {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const folder = zip.folder(folderName)
  const used = new Set()

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const filename = uniqueFilename(item.filename || `image-${i + 1}.jpg`, used)
    const blob = await pathToBlob(item.path)
    folder.file(filename, blob)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(zipBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${folderName}.zip`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// #ifdef APP-PLUS
/** App：保存到应用文档目录下的子文件夹 */
function saveToAppFolder(items, folderName) {
  return new Promise((resolve, reject) => {
    const relativeDir = `_doc/lyl-compress/${folderName}/`

    const saveNext = (index) => {
      if (index >= items.length) {
        resolve(relativeDir)
        return
      }
      const item = items[index]
      const filename = item.filename || `image-${index + 1}.jpg`
      plus.io.resolveLocalFileSystemURL(
        item.path,
        (entry) => {
          plus.io.resolveLocalFileSystemURL(
            '_doc',
            (docEntry) => {
              docEntry.getDirectory(
                'lyl-compress',
                { create: true },
                (root) => {
                  root.getDirectory(
                    folderName,
                    { create: true },
                    (dir) => {
                      entry.copyTo(
                        dir,
                        filename,
                        () => saveNext(index + 1),
                        () => saveNext(index + 1)
                      )
                    },
                    () => reject(new Error('创建文件夹失败'))
                  )
                },
                () => reject(new Error('创建目录失败'))
              )
            },
            () => reject(new Error('无法访问文档目录'))
          )
        },
        () => saveNext(index + 1)
      )
    }

    saveNext(0)
  })
}
// #endif

/**
 * 批量下载到同一文件夹
 * H5：下载 ZIP（内含文件夹）；App：写入 _doc/lyl-compress/{文件夹名}/；其他端回退相册逐张保存
 * @param {{ path: string, filename?: string }[]} items
 * @param {string} [folderNamePrefix]
 * @returns {Promise<{ mode: 'zip' | 'folder' | 'album', folderName: string, path?: string }>}
 */
export async function downloadImagesToFolder(items, folderNamePrefix = 'compressed-images') {
  const list = items.filter((i) => i?.path)
  if (!list.length) {
    return Promise.reject(new Error('没有可下载的图片'))
  }

  const folderName = timestampFolderName(folderNamePrefix)

  // #ifdef H5
  await downloadAsZipFolder(list, folderName)
  return { mode: 'zip', folderName }
  // #endif

  // #ifdef APP-PLUS
  const dir = await saveToAppFolder(list, folderName)
  return { mode: 'folder', folderName, path: dir }
  // #endif

  // #ifndef H5 || APP-PLUS
  await saveImagesBatch(list)
  return { mode: 'album', folderName }
  // #endif
}

export { timestampFolderName }
