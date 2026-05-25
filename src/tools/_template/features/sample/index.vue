<template>
  <view class="feature-panel">
    <text>在此实现子功能 UI</text>
  </view>
</template>

<script setup>
import { useToolContext } from '@/tools/core/useToolContext'

const { manifest } = useToolContext()
</script>

<style lang="scss" scoped>
.feature-panel {
  padding: 24rpx;
  background: #fff;
  border-radius: 12rpx;
}
</style>
