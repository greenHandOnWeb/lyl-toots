<template>
  <view class="panel">
    <view class="block">
      <view class="upload-zone" @click="onChoose">
        <text class="upload-title">{{ previewSrc ? '重新选择' : '点击选择图片' }}</text>
        <text class="hint">JPG · PNG · GIF · WebP · BMP</text>
      </view>

      <view v-if="previewSrc" class="preview-wrap">
        <image class="preview-img" :src="previewSrc" mode="aspectFit" />
      </view>
    </view>

    <view class="block">
      <view class="row">
        <text class="label">压缩质量</text>
        <text class="quality">{{ quality }}%</text>
      </view>
      <slider
        :value="quality"
        min="10"
        max="100"
        step="5"
        :activeColor="theme.accent"
        :backgroundColor="theme.track"
        block-color="#ffffff"
        block-size="18"
        @change="(e) => setQuality(e.detail.value)"
      />
    </view>

    <view class="btn-group">
      <uv-button
        type="primary"
        text="开始压缩"
        :color="theme.accent"
        :disabled="!previewSrc || compressing"
        :loading="compressing"
        @click="onCompress"
      />
      <uv-button
        type="primary"
        plain
        :text="downloadBtnText"
        :color="theme.accent"
        :disabled="!canDownload"
        @click="onDownload"
      />
    </view>

    <CompressEffectBadge
      v-if="savePercent > 0"
      :percent="savePercent"
      large
      :subtitle="sizeLine"
    />

    <canvas
      canvas-id="compressCanvas"
      id="compressCanvas"
      class="hidden-canvas"
      :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
    />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useToolContext } from '@/tools/core/useToolContext'
import { useImageCompress } from '../../composables/useImageCompress'
import { formatSize } from '@/tools/core/utils/formatSize'
import CompressEffectBadge from '../../components/CompressEffectBadge.vue'
import { IC_THEME } from '../../styles/theme.js'

const theme = IC_THEME
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
  canDownload,
  setQuality,
  chooseImage,
  compress,
  downloadCompressed,
} = useImageCompress({
  maxSide: meta.maxSide,
  canvasId: 'compressCanvas',
})

const sizeLine = computed(() => {
  const { original, compressed } = sizeInfo.value
  if (!compressed) return ''
  return `${formatSize(original)} → ${formatSize(compressed)}`
})

const downloadBtnText = computed(() => {
  // #ifdef H5
  return '下载'
  // #endif
  // #ifndef H5
  return '保存到相册'
  // #endif
})

async function onChoose() {
  try {
    await chooseImage()
  } catch {
    /* 取消 */
  }
}

async function onCompress() {
  try {
    await compress()
    const title = savePercent.value > 0 ? `压缩 ${savePercent.value}%` : '完成'
    uni.showToast({ title, icon: 'success' })
  } catch {
    uni.showToast({ title: '压缩失败', icon: 'none' })
  }
}

async function onDownload() {
  try {
    await downloadCompressed()
    uni.showToast({ title: '已保存', icon: 'success' })
  } catch {
    uni.showToast({ title: '失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.panel {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.block {
  @include ic-card;
  padding: 24rpx 28rpx;
}

.upload-zone {
  padding: 40rpx 24rpx;
  text-align: center;
  background: $ic-accent-soft;
  border-radius: $ic-radius-sm;
  border: 2rpx dashed $ic-border-accent;
}

.upload-title {
  font-size: 30rpx;
  font-weight: 500;
  color: $ic-accent;
  display: block;
}

.hint {
  font-size: 24rpx;
  color: $ic-text-tertiary;
  margin-top: 8rpx;
  display: block;
}

.preview-wrap {
  margin-top: 20rpx;
  border-radius: $ic-radius-sm;
  overflow: hidden;
  background: $ic-accent-soft;
  border: 1rpx solid $ic-border;
}

.preview-img {
  width: 100%;
  height: 360rpx;
  display: block;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.label {
  @include ic-section-title;
  color: $ic-text-secondary;
}

.quality {
  font-size: 30rpx;
  font-weight: 600;
  color: $ic-success;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.hidden-canvas {
  position: fixed;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
</style>
