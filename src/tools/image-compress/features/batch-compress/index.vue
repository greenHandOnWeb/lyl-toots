<template>
  <view class="panel">
    <view class="block">
      <view class="btn-row">
        <uv-button
          type="primary"
          text="选择图片"
          :color="theme.accent"
          :disabled="compressing"
          @click="onAdd"
        />
        <!-- #ifdef H5 -->
        <uv-button
          type="primary"
          plain
          text="文件夹"
          :color="theme.accent"
          :disabled="compressing"
          @click="onAddFolder"
        />
        <!-- #endif -->
      </view>
      <text class="hint">最多 {{ meta.maxBatch }} 张
        <!-- #ifdef H5 -->
        · 文件夹 {{ meta.maxFolderImages }} 张
        <!-- #endif -->
      </text>
      <text v-if="items.length" class="clear-link" @click="onClear">清空</text>
    </view>

    <CompressEffectBadge
      v-if="batchSummary?.savePercent"
      :percent="batchSummary.savePercent"
      :subtitle="`共 ${batchSummary.count} 张 · ${formatSize(batchSummary.original)} → ${formatSize(batchSummary.compressed)}`"
    />

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

    <view v-if="items.length" class="list">
      <view v-for="item in items" :key="item.id" class="list-item">
        <image class="thumb" :src="item.compressedPath || item.path" mode="aspectFill" />
        <view class="info">
          <text class="name">{{ item.name }}</text>
          <text class="meta">
            {{ formatSize(item.originalSize) }}
            <text v-if="item.compressedSize"> → {{ formatSize(item.compressedSize) }}</text>
            <text v-if="item.savePercent > 0" class="pct"> -{{ item.savePercent }}%</text>
          </text>
        </view>
        <view class="ops">
          <text v-if="item.status === 'done'" class="op" @click="downloadOne(item)">下载</text>
          <text class="op op--light" @click="removeItem(item.id)">移除</text>
        </view>
      </view>
    </view>

    <view v-else class="empty">添加图片后开始批量压缩</view>

    <view class="btn-group">
      <uv-button
        type="primary"
        text="批量压缩"
        :color="theme.accent"
        :disabled="!canCompress"
        :loading="compressing"
        @click="onCompressAll"
      />
      <uv-button
        type="primary"
        plain
        :text="downloadBtnText"
        :color="theme.accent"
        :disabled="!canDownloadAll"
        :loading="downloading"
        @click="onDownloadAll"
      />
    </view>

    <canvas
      canvas-id="compressCanvasBatch"
      id="compressCanvasBatch"
      class="hidden-canvas"
      :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
    />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useToolContext } from '@/tools/core/useToolContext'
import { useImageBatchCompress } from '../../composables/useImageBatchCompress'
import { formatSize } from '@/tools/core/utils/formatSize'
import CompressEffectBadge from '../../components/CompressEffectBadge.vue'
import { IC_THEME } from '../../styles/theme.js'

const theme = IC_THEME
const { manifest } = useToolContext()
const meta = manifest?.meta || {}

const {
  items,
  quality,
  compressing,
  downloading,
  canvasW,
  canvasH,
  batchSummary,
  canCompress,
  canDownloadAll,
  setQuality,
  addImages,
  addFromFolder,
  removeItem,
  clearAll,
  compressAll,
  downloadAll,
  downloadOne,
} = useImageBatchCompress({
  maxSide: meta.maxSide,
  defaultQuality: meta.defaultQuality,
  maxBatch: meta.maxBatch,
  maxFolderImages: meta.maxFolderImages,
})

const downloadBtnText = computed(() => {
  // #ifdef H5
  return '下载 ZIP'
  // #endif
  // #ifndef H5
  return '批量保存'
  // #endif
})

async function onAdd() {
  try {
    await addImages()
  } catch {
    /* 取消 */
  }
}

async function onAddFolder() {
  try {
    await addFromFolder()
  } catch (e) {
    const msg = e?.message || e?.errMsg || ''
    if (msg && !/cancel|取消/i.test(msg)) {
      uni.showToast({ title: msg, icon: 'none' })
    }
  }
}

function onClear() {
  clearAll()
}

async function onCompressAll() {
  await compressAll()
}

async function onDownloadAll() {
  await downloadAll()
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

.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hint {
  font-size: 24rpx;
  color: $ic-text-tertiary;
  margin-top: 16rpx;
  display: block;
}

.clear-link {
  font-size: 24rpx;
  color: $ic-text-tertiary;
  margin-top: 12rpx;
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
}

.quality {
  font-size: 30rpx;
  font-weight: 600;
  color: $ic-success;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.list-item {
  @include ic-card;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 20rpx;
}

.thumb {
  width: 96rpx;
  height: 96rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
  background: $ic-accent-soft;
  border: 1rpx solid $ic-border;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 28rpx;
  color: $ic-text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.meta {
  font-size: 24rpx;
  color: $ic-text-tertiary;
  margin-top: 4rpx;
  display: block;
}

.pct {
  color: $ic-success;
  font-weight: 600;
}

.ops {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  flex-shrink: 0;
}

.op {
  font-size: 24rpx;
  color: $ic-accent;

  &--light {
    color: $ic-text-tertiary;
  }
}

.empty {
  text-align: center;
  padding: 48rpx;
  font-size: 26rpx;
  color: $ic-text-tertiary;
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
