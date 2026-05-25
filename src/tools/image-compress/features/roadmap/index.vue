<template>
  <view class="feature-panel">
    <text class="hint">以下能力在 manifest.plannedFeatures 中登记，实现后移入 features 即可上线 Tab。</text>
    <view v-for="item in planned" :key="item.id" class="roadmap-item">
      <text class="roadmap-name">{{ item.name }}</text>
      <text class="roadmap-desc">{{ item.desc }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useToolContext } from '@/tools/core/useToolContext'

const { manifest } = useToolContext()
const planned = computed(() => manifest?.plannedFeatures || [])
</script>

<style lang="scss" scoped>
.feature-panel {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
}

.hint {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 24rpx;
}

.roadmap-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.roadmap-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  display: block;
}

.roadmap-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}
</style>
