<template>
  <view class="detail-page">
    <component
      :is="currentToolEntry"
      v-if="currentToolEntry && toolManifest"
      :manifest="toolManifest"
      :route-query="routeQuery"
    />
    <view v-else class="error-wrap">
      <text class="error-text">未找到该工具，请从首页重新进入</text>
      <uv-button type="primary" text="返回首页" @click="goHome" />
    </view>
  </view>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getToolById, resolveToolEntry } from '@/tools/registry'

const currentToolEntry = shallowRef(null)
const toolManifest = ref(null)
const routeQuery = ref({})

onLoad((options) => {
  const id = options?.id || ''
  routeQuery.value = { ...options }

  const manifest = getToolById(id)
  if (manifest) {
    toolManifest.value = manifest
    currentToolEntry.value = resolveToolEntry(id)
    uni.setNavigationBarTitle({ title: manifest.name })
  } else {
    toolManifest.value = null
    currentToolEntry.value = null
    uni.showToast({ title: '无效的工具 ID', icon: 'none' })
  }
})

function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.detail-page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: $bg-color;
}

.error-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
  gap: 32rpx;
}

.error-text {
  font-size: 28rpx;
  color: #999;
}
</style>
