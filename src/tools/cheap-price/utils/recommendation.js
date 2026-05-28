/**
 * 综合价格、店铺可信度、评价等维度计算性价比得分（0–100）
 */
export function scoreOffer(offer) {
  const priceScore = Math.max(0, 100 - offer.priceRank * 12)
  const trustScore = offer.shopTrust * 10
  const ratingScore = (offer.rating / 5) * 100
  const reviewScore = Math.min(100, Math.log10(offer.reviewCount + 1) * 25)
  const salesScore = Math.min(100, Math.log10(offer.sales + 1) * 20)

  const total =
    priceScore * 0.38 +
    trustScore * 0.28 +
    ratingScore * 0.22 +
    reviewScore * 0.07 +
    salesScore * 0.05

  return Math.round(total)
}

export function pickRecommendation(offers) {
  if (!offers.length) return null
  const sorted = [...offers].sort((a, b) => b.valueScore - a.valueScore)
  const best = sorted[0]
  const reasons = []
  if (best.priceRank === 0) reasons.push('当前报价最低')
  if (best.shopTrust >= 8.5) reasons.push('店铺可信度较高')
  if (best.rating >= 4.7) reasons.push('用户评价优秀')
  if (best.price > sorted[sorted.length - 1]?.price * 1.05 && best.shopTrust >= 9) {
    reasons.push('虽非最低价，但店铺与口碑更稳')
  }
  return {
    offer: best,
    reasons: reasons.length ? reasons : ['综合性价比领先'],
  }
}
