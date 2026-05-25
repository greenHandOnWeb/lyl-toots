<template>
  <view class="page">
    <view class="profile-card">
      <view class="avatar">🧑‍💻</view>
      <text class="nickname">极客开发者</text>
      <text class="subtitle">前端极客工具箱 v1.0.0</text>
    </view>

    <uv-cell-group :border="true">
      <uv-cell title="关于应用" :value="'uni-app + Vue3'" is-link @click="showAbout" />
      <uv-cell title="技术栈" value="uv-ui / Vite / rpx" />
      <uv-cell title="支持平台" value="H5 / iOS / Android" />
    </uv-cell-group>
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
.page {
  min-height: 100vh;
  padding: 24rpx;
}

.profile-card {
  background: linear-gradient(135deg, #2979ff, #5cadff);
  border-radius: 16rpx;
  padding: 48rpx 32rpx;
  margin-bottom: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  font-size: 96rpx;
  margin-bottom: 16rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8rpx;
}

.subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}
</style>
