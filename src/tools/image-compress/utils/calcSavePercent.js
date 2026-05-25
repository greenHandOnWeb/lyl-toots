/**
 * 计算体积节省比例（压缩效果）
 * @param {number} original 原始字节
 * @param {number} compressed 压缩后字节
 * @returns {number} 0–100 整数，无效时为 0
 */
export function calcSavePercent(original, compressed) {
  if (!original || !compressed || compressed >= original) return 0
  return Math.round((1 - compressed / original) * 100)
}
