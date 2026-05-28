<template>
  <view
    class="offer-item"
    :class="{ active: active }"
    @click="$emit('select')"
  >
    <view class="rank" :class="{ 'rank--top': rank === 1 }">{{ rank }}</view>
    <view class="body">
      <view class="row-top">
        <text class="platform">{{ platformName }}</text>
        <text class="price">¥{{ offer.price }}</text>
      </view>
      <text class="title">{{ offer.title }}</text>
      <text class="meta">
        {{ offer.shopName }} · 可信度 {{ offer.shopTrust }} · 评分 {{ offer.rating }} · {{ offer.reviewCount }} 评
      </text>
      <text class="score">性价比 {{ offer.valueScore }} 分</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { getPlatform } from '../utils/platforms'

const props = defineProps({
  offer: { type: Object, required: true },
  rank: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
})

defineEmits(['select'])

const platformName = computed(() => getPlatform(props.offer.platformId).name)
</script>

<style lang="scss" scoped>
@import '@/styles/palette.scss';

.offer-item {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  background: $palette-surface;
  border: 2rpx solid $palette-border;
  border-radius: 12rpx;

  &.active {
    border-color: $palette-primary;
    background: $palette-primary-soft;
  }
}

.rank {
  width: 44rpx;
  height: 44rpx;
  line-height: 44rpx;
  text-align: center;
  font-size: 24rpx;
  font-weight: 600;
  color: $palette-text-tertiary;
  background: $palette-surface-muted;
  border-radius: 8rpx;
  flex-shrink: 0;

  &--top {
    background: $palette-success;
    color: $palette-surface;
  }
}

.body {
  flex: 1;
  min-width: 0;
}

.row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12rpx;
}

.platform {
  font-size: 24rpx;
  font-weight: 600;
  color: $palette-primary;
}

.price {
  font-size: 32rpx;
  font-weight: 700;
  color: $palette-text;
}

.title {
  font-size: 26rpx;
  color: $palette-text;
  margin-top: 8rpx;
  display: block;
  line-height: 1.4;
}

.meta {
  font-size: 22rpx;
  color: $palette-text-tertiary;
  margin-top: 6rpx;
  display: block;
}

.score {
  font-size: 22rpx;
  color: $palette-success;
  margin-top: 8rpx;
  display: block;
  font-weight: 500;
}
</style>
