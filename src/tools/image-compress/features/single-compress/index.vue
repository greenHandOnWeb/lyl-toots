<template>
  <view class="feature-panel">
    <uv-button type="primary" text="选择图片" @click="onChoose" />

    <view v-if="previewSrc" class="preview-box">
      <image class="preview-img" :src="previewSrc" mode="aspectFit" />
    </view>

    <view class="slider-row">
      <text class="label">压缩质量：{{ quality }}%</text>
      <slider
        :value="quality"
        min="10"
        max="100"
        step="5"
        activeColor="#2979ff"
        @change="(e) => setQuality(e.detail.value)"
      />
    </view>

    <uv-button
      type="success"
      text="开始压缩"
      :disabled="!previewSrc || compressing"
      :loading="compressing"
      @click="onCompress"
    />

    <view v-if="sizeInfo.original > 0" class="size-info">
      <text>压缩前：{{ formatSize(sizeInfo.original) }}</text>
      <text>压缩后：{{ formatSize(sizeInfo.compressed) }}</text>
      <text v-if="sizeInfo.compressed > 0" class="ratio">节省约 {{ savePercent }}%</text>
    </view>

    <!-- H5：Canvas；App：也可 uni.compressImage，逻辑见 composables/useImageCompress -->
    <canvas
      canvas-id="compressCanvas"
      id="compressCanvas"
      class="hidden-canvas"
      :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
    />
  </view>
</template>

<script setup>
import { useToolContext } from '@/tools/core/useToolContext'
import { useImageCompress } from '../../composables/useImageCompress'
import { formatSize } from '@/tools/core/utils/formatSize'

const { manifest } = useToolContext()
const meta = manifest?.meta || {}

const {
  previewSrc,
  quality,
  compressing,
  canvasW,
  canvasH,
  sizeInfo,
  savePercent,
  setQuality,
  chooseImage,
  compress,
} = useImageCompress({
  maxSide: meta.maxSide,
  canvasId: 'compressCanvas',
})

async function onChoose() {
  try {
    await chooseImage()
  } catch {
    /* 用户取消 */
  }
}

async function onCompress() {
  try {
    await compress()
    uni.showToast({ title: '压缩完成', icon: 'success' })
  } catch {
    uni.showToast({ title: '压缩失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.feature-panel {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.preview-box {
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  min-height: 320rpx;
}

.preview-img {
  width: 100%;
  height: 400rpx;
}

.slider-row {
  background: #fff;
  padding: 24rpx;
  border-radius: 12rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.size-info {
  background: #fff;
  padding: 24rpx;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  font-size: 26rpx;
  color: #666;
}

.ratio {
  color: #19be6b;
  font-weight: 600;
}

.hidden-canvas {
  position: fixed;
  left: -9999px;
  top: -9999px;
  opacity: 0;
  pointer-events: none;
}
</style>
