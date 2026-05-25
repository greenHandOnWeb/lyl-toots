<template>
  <view class="feature-panel">
    <uv-textarea
      v-model="inputText"
      placeholder="请输入 JSON 字符串"
      :maxlength="-1"
      height="240"
      count
    />

    <view class="btn-row">
      <uv-button type="primary" size="small" text="格式化" @click="format" />
      <uv-button type="warning" size="small" text="压缩" @click="minify" />
      <uv-button type="success" size="small" text="复制" @click="copy" />
    </view>

    <view class="output-title">输出结果</view>
    <scroll-view scroll-y class="output-box">
      <rich-text v-if="highlightHtml" :nodes="highlightHtml" />
      <text v-else class="placeholder">格式化后的 JSON 将显示在这里</text>
    </scroll-view>
  </view>
</template>

<script setup>
import { useJsonFormatter } from '../../composables/useJsonFormatter'

const { inputText, highlightHtml, format, minify, copy } = useJsonFormatter()
</script>

<style lang="scss" scoped>
.feature-panel {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.output-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.output-box {
  background: #1e1e1e;
  border-radius: 12rpx;
  padding: 24rpx;
  min-height: 360rpx;
  max-height: 600rpx;
  box-sizing: border-box;
}

.placeholder {
  color: #888;
  font-size: 26rpx;
}
</style>
