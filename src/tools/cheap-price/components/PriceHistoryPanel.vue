<template>
  <view v-if="history || showEmpty" class="history-panel">
    <text class="section-title">{{ title }}</text>
    <text v-if="history?.partial" class="history-note">
      接口未返回完整月度曲线，以下为根据历史高低价与当前价推算的区间参考
    </text>
    <text v-if="!history" class="history-note">该商品暂无历史价格曲线，仅展示当前实时报价</text>

    <template v-if="history">
      <view class="stats-row">
        <view class="stat">
          <text class="stat-label">近 3 月</text>
          <text class="stat-val">¥{{ history.m3.low }} ~ ¥{{ history.m3.high }}</text>
          <text class="stat-avg">均价 ¥{{ history.m3.avg }}</text>
        </view>
        <view class="stat">
          <text class="stat-label">近 6 月</text>
          <text class="stat-val">¥{{ history.m6.low }} ~ ¥{{ history.m6.high }}</text>
          <text class="stat-avg">均价 ¥{{ history.m6.avg }}</text>
        </view>
        <view class="stat">
          <text class="stat-label">近 1 年</text>
          <text class="stat-val">¥{{ history.y1.low }} ~ ¥{{ history.y1.high }}</text>
          <text class="stat-avg">均价 ¥{{ history.y1.avg }}</text>
        </view>
      </view>
      <view class="chart">
        <view
          v-for="(point, i) in history.series"
          :key="i"
          class="bar-wrap"
        >
          <view
            class="bar"
            :style="{ height: barHeight(point.price) + '%' }"
          />
          <text class="bar-label">{{ point.label }}</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  history: { type: Object, default: null },
  dataSource: { type: String, default: '' },
  showEmpty: { type: Boolean, default: false },
})

const title = computed(() => {
  if (!props.history && props.dataSource === 'juhe') return '价格走势'
  if (props.history?.live && !props.history?.partial) return '价格走势（聚合数据）'
  if (props.dataSource === 'juhe') return '价格走势（部分来自接口）'
  return '价格走势（演示估算）'
})

const maxPrice = computed(() => {
  if (!props.history?.series?.length) return 1
  return Math.max(...props.history.series.map((s) => s.price))
})

const minPrice = computed(() => {
  if (!props.history?.series?.length) return 0
  return Math.min(...props.history.series.map((s) => s.price))
})

function barHeight(price) {
  const max = maxPrice.value
  const min = minPrice.value
  const range = max - min || 1
  return 20 + ((price - min) / range) * 70
}
</script>

<style lang="scss" scoped>
@import '@/styles/palette.scss';

.history-panel {
  background: $palette-surface;
  border: 1rpx solid $palette-border;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
}

.section-title {
  font-size: 26rpx;
  font-weight: 600;
  color: $palette-text-secondary;
  display: block;
  margin-bottom: 8rpx;
}

.history-note {
  font-size: 22rpx;
  color: $palette-text-tertiary;
  line-height: 1.5;
  display: block;
  margin-bottom: 12rpx;
}

.stats-row {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.stat {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12rpx;
  padding: 12rpx 0;
  border-bottom: 1rpx solid $palette-border;
}

.stat-label {
  font-size: 24rpx;
  font-weight: 600;
  color: $palette-text;
  min-width: 100rpx;
}

.stat-val {
  font-size: 24rpx;
  color: $palette-text-secondary;
}

.stat-avg {
  font-size: 22rpx;
  color: $palette-text-tertiary;
}

.chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200rpx;
  padding-top: 16rpx;
  gap: 4rpx;
}

.bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 80%;
  min-height: 8rpx;
  background: $palette-primary;
  border-radius: 6rpx 6rpx 0 0;
  opacity: 0.85;
}

.bar-label {
  font-size: 18rpx;
  color: $palette-text-tertiary;
  margin-top: 8rpx;
  transform: scale(0.9);
}
</style>
