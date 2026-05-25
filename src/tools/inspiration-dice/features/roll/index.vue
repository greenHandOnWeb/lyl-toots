<template>
  <view class="feature-panel">
    <view class="scene">
      <view class="cube" :style="cubeStyle">
        <view class="face front">{{ faces[0] }}</view>
        <view class="face back">{{ faces[1] }}</view>
        <view class="face right">{{ faces[2] }}</view>
        <view class="face left">{{ faces[3] }}</view>
        <view class="face top">{{ faces[4] }}</view>
        <view class="face bottom">{{ faces[5] }}</view>
      </view>
    </view>

    <text class="result-text">{{ resultKeyword || '点击按钮投掷灵感' }}</text>

    <uv-button type="primary" text="投掷灵感" :loading="isRolling" @click="onRoll" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useToolContext } from '@/tools/core/useToolContext'
import { useInspirationDice } from '../../composables/useInspirationDice'

const { manifest } = useToolContext()
const faceList = computed(() => manifest?.meta?.defaultFaces || [])

const { faces, cubeStyle, isRolling, resultKeyword, roll } = useInspirationDice(faceList)

async function onRoll() {
  const result = await roll()
  if (result) {
    uni.showToast({ title: `灵感：${result.keyword}`, icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.feature-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 24rpx;
  gap: 48rpx;
}

.scene {
  width: 320rpx;
  height: 320rpx;
  perspective: 800rpx;
}

.cube {
  width: 160rpx;
  height: 160rpx;
  position: relative;
  margin: 80rpx auto;
  transform-style: preserve-3d;
}

.face {
  position: absolute;
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(145deg, #059669, #34d399);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 16rpx;
  backface-visibility: hidden;
  box-sizing: border-box;
}

.front {
  transform: rotateY(0deg) translateZ(80rpx);
}
.back {
  transform: rotateY(180deg) translateZ(80rpx);
}
.right {
  transform: rotateY(90deg) translateZ(80rpx);
}
.left {
  transform: rotateY(-90deg) translateZ(80rpx);
}
.top {
  transform: rotateX(90deg) translateZ(80rpx);
}
.bottom {
  transform: rotateX(-90deg) translateZ(80rpx);
}

.result-text {
  font-size: 48rpx;
  font-weight: 700;
  color: #059669;
  text-align: center;
  min-height: 64rpx;
}
</style>
