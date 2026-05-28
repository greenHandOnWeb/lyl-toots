import { ref, computed, onMounted } from 'vue'
import { PLATFORMS } from '../utils/platforms'
import { fetchPriceOffers, checkPriceApiHealth, isLivePriceEnabled } from '../api/priceApi'
import { scoreOffer, pickRecommendation } from '../utils/recommendation'

export function usePriceCompare() {
  const keyword = ref('')
  const productCode = ref('')
  const selectedPlatforms = ref(PLATFORMS.map((p) => p.id))
  const loading = ref(false)
  const searched = ref(false)
  const offers = ref([])
  const selectedOfferId = ref('')
  const dataSource = ref('')
  const statusHint = ref('')
  const apiReady = ref(false)

  const recommendation = computed(() => {
    if (!offers.value.length) return null
    const scored = offers.value.map((o) => ({ ...o, valueScore: scoreOffer(o) }))
    return pickRecommendation(scored)
  })

  const selectedOffer = computed(
    () => offers.value.find((o) => o.id === selectedOfferId.value) || offers.value[0] || null
  )

  function togglePlatform(id) {
    const set = new Set(selectedPlatforms.value)
    if (set.has(id)) {
      if (set.size > 1) set.delete(id)
    } else {
      set.add(id)
    }
    selectedPlatforms.value = [...set]
  }

  async function search() {
    const q = keyword.value.trim()
    const code = productCode.value.trim()
    if (!q && !code) {
      uni.showToast({ title: '请输入商品名称或编码', icon: 'none' })
      return
    }
    if (!selectedPlatforms.value.length) {
      uni.showToast({ title: '请至少选择一个平台', icon: 'none' })
      return
    }

    loading.value = true
    searched.value = false
    statusHint.value = ''

    try {
      const { offers: list, dataSource: src, message } = await fetchPriceOffers({
        keyword: q,
        code,
        platformIds: selectedPlatforms.value,
      })

      const scored = list.map((o) => ({ ...o, valueScore: scoreOffer(o) }))
      offers.value = scored
      dataSource.value = src
      selectedOfferId.value = scored[0]?.id || ''
      searched.value = true

      if (message) statusHint.value = message
      if (!scored.length) {
        uni.showToast({ title: message || '未找到相关商品', icon: 'none' })
      }
    } catch (e) {
      uni.showToast({ title: e.message || '查询失败', icon: 'none', duration: 3000 })
      searched.value = true
      offers.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    if (!isLivePriceEnabled()) {
      statusHint.value = '演示模式：配置 JUHE_API_KEY 并启动代理后可查真实报价'
      return
    }
    const health = await checkPriceApiHealth()
    apiReady.value = health.ok && health.hasKey
    if (!health.ok) {
      statusHint.value =
        '未连接比价代理：请运行 pnpm run dev:proxy，并在 .env 中配置 JUHE_API_KEY'
    } else if (!health.hasKey) {
      statusHint.value = '代理已启动但未配置 JUHE_API_KEY，请在环境变量中设置'
    } else {
      statusHint.value = '已连接聚合数据，查询结果为各商城实时报价'
    }
  })

  function selectOffer(id) {
    selectedOfferId.value = id
  }

  return {
    keyword,
    productCode,
    platforms: PLATFORMS,
    selectedPlatforms,
    loading,
    searched,
    offers,
    selectedOfferId,
    recommendation,
    selectedOffer,
    dataSource,
    statusHint,
    apiReady,
    togglePlatform,
    search,
    selectOffer,
  }
}
