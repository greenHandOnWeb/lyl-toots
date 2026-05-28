<template>
  <view v-if="data" class="rec-card">
    <text class="rec-tag">性价比推荐</text>
    <text class="rec-title">{{ data.offer.title }}</text>
    <view class="rec-price-row">
      <text class="rec-price">¥{{ data.offer.price }}</text>
      <text class="rec-shop">{{ data.offer.shopName }}</text>
    </view>
    <view class="rec-reasons">
      <text v-for="(r, i) in data.reasons" :key="i" class="reason">· {{ r }}</text>
    </view>
    <text class="rec-score">综合得分 {{ data.offer.valueScore }} / 100</text>
  </view>
</template>

<script setup>
defineProps({
  data: { type: Object, default: null },
})
</script>

<style lang="scss" scoped>
@import '@/styles/palette.scss';

.rec-card {
  background: $palette-success-soft;
  border: 2rpx solid $palette-border-accent;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.rec-tag {
  font-size: 22rpx;
  font-weight: 600;
  color: $palette-success;
  align-self: flex-start;
  padding: 4rpx 12rpx;
  background: $palette-surface;
  border-radius: 8rpx;
}

.rec-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $palette-text;
  line-height: 1.45;
}

.rec-price-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 16rpx;
}

.rec-price {
  font-size: 40rpx;
  font-weight: 700;
  color: $palette-success;
}

.rec-shop {
  font-size: 24rpx;
  color: $palette-text-secondary;
}

.rec-reasons {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.reason {
  font-size: 24rpx;
  color: $palette-text-secondary;
}

.rec-score {
  font-size: 22rpx;
  color: $palette-text-tertiary;
  margin-top: 4rpx;
}
</style>
