<template>
  <view class="feature-panel">
    <view class="wheel-container">
      <view class="wheel-pointer">▼</view>
      <view
        class="wheel-rotate-layer"
        :style="{
          transform: `rotate(${rotateDeg}deg)`,
          transition: spinning
            ? `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.3, 1)`
            : 'none',
        }"
      >
        <canvas
          canvas-id="wheelCanvas"
          id="wheelCanvas"
          class="wheel-canvas"
          :style="{ width: canvasSize + 'px', height: canvasSize + 'px' }"
        />
      </view>
      <view class="wheel-center-btn" @click="onSpin">
        <text>{{ spinning ? '抽奖中...' : '开始抽奖' }}</text>
      </view>
    </view>
    <text class="tip">点击中心按钮，转盘将随机停在某项</text>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useToolContext } from '@/tools/core/useToolContext'
import { useLuckyWheel } from '../../composables/useLuckyWheel'

const { manifest } = useToolContext()
const prizes = manifest?.meta?.defaultPrizes || []

const { canvasSize, rotateDeg, spinning, duration, drawWheel, spin } = useLuckyWheel({
  prizes,
  canvasId: 'wheelCanvas',
})

onMounted(() => drawWheel())

async function onSpin() {
  const result = await spin()
  if (result) {
    uni.showModal({
      title: '抽奖结果',
      content: `恭喜抽中：${result.label}！`,
      showCancel: false,
    })
  }
}
</script>

<style lang="scss" scoped>
.feature-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
}

.wheel-container {
  position: relative;
  width: 560rpx;
  height: 560rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-rotate-layer {
  width: 560rpx;
  height: 560rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-canvas {
  display: block;
}

.wheel-pointer {
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40rpx;
  color: #e74c3c;
  z-index: 10;
}

.wheel-center-btn {
  position: absolute;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(180deg, #ff6b6b, #ee5a5a);
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
}

.tip {
  margin-top: 32rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
