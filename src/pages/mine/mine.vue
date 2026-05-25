<template>
  <view class="page">
    <view class="profile">
      <text class="avatar">🧑‍💻</text>
      <text class="name">极客开发者</text>
      <text class="ver">v1.0.0</text>
    </view>

    <view class="list-card">
      <uv-cell-group :border="false">
        <uv-cell title="关于应用" :value="'uni-app + Vue3'" is-link @click="showAbout" />
        <uv-cell title="技术栈" value="uv-ui / Vite / rpx" />
        <uv-cell title="支持平台" value="H5 / iOS / Android" />
      </uv-cell-group>
    </view>
  </view>
</template>

<script setup>
function showAbout() {
  uni.showModal({
    title: '关于',
    content:
      '前端极客工具箱：一套代码多端运行。\n集成图片压缩、JSON 格式化、随机转盘、灵感骰子四大工具。',
    showCancel: false,
  })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  padding: 24rpx;
  background: $bg-color;
}

.profile {
  padding: 48rpx 0 40rpx;
  text-align: center;
}

.avatar {
  font-size: 80rpx;
  display: block;
}

.name {
  font-size: 32rpx;
  font-weight: 500;
  color: $text-color;
  margin-top: 16rpx;
  display: block;
}

.ver {
  font-size: 24rpx;
  color: $text-tertiary;
  margin-top: 8rpx;
  display: block;
}

.list-card {
  background: $surface-color;
  border-radius: 16rpx;
  border: 1rpx solid $border-color;
  overflow: hidden;
}
</style>
