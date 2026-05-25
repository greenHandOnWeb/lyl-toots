<template>
  <view v-if="percent > 0" class="effect-badge" :class="{ large }">
    <text class="effect-label">压缩效果</text>
    <text class="effect-value">{{ percent }}%</text>
    <text v-if="subtitle" class="effect-sub">{{ subtitle }}</text>
  </view>
</template>

<script setup>
defineProps({
  percent: { type: Number, default: 0 },
  subtitle: { type: String, default: '' },
  large: { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';

.effect-badge {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12rpx 20rpx;
  padding: 20rpx 24rpx;
  background: $ic-success-soft;
  border-radius: $ic-radius-sm;
  border: 1rpx solid $ic-border-accent;

  &.large {
    padding: 24rpx 28rpx;

    .effect-value {
      font-size: 40rpx;
    }
  }
}

.effect-label {
  font-size: 26rpx;
  color: $ic-text-secondary;
  font-weight: 500;
}

.effect-value {
  font-size: 36rpx;
  font-weight: 600;
  color: $ic-success;
}

.effect-sub {
  width: 100%;
  font-size: 24rpx;
  color: $ic-text-tertiary;
  line-height: 1.5;
}
</style>
