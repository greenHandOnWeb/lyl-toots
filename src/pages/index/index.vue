<template>
  <view class="page">
    <!-- 搜索框：实时过滤工具 -->
    <view class="search-wrap">
      <uv-search
        v-model="keyword"
        placeholder="搜索工具名称"
        :show-action="false"
        shape="round"
        bg-color="#ffffff"
        border-color="#cbd5e1"
        @change="onSearchChange"
        @clear="onSearchChange"
      />
    </view>

    <!-- 工具宫格 -->
    <view class="grid-wrap">
      <uv-grid :col="2" :border="false">
        <uv-grid-item
          v-for="item in filteredTools"
          :key="item.id"
          @click="goToolDetail(item.id)"
        >
          <view class="tool-card">
            <text class="tool-icon">{{ item.icon }}</text>
            <text class="tool-name">{{ item.name }}</text>
            <text class="tool-desc">{{ item.desc }}</text>
          </view>
        </uv-grid-item>
      </uv-grid>
      <view v-if="filteredTools.length === 0" class="empty-tip">未找到匹配的工具</view>
    </view>

    <!-- 条件编译：H5 网页分享 / App 原生分享 -->
    <view class="share-section">
      <!-- #ifdef H5 -->
      <uv-button type="primary" plain size="small" text="网页版分享" @click="shareOnH5" />
      <!-- #endif -->

      <!-- #ifdef APP-PLUS -->
      <uv-button type="primary" plain size="small" text="原生分享" @click="shareOnApp" />
      <!-- #endif -->
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { filterToolList } from '@/tools/registry'

const keyword = ref('')

/** 从注册中心读取工具列表，新增工具无需改首页 */
const filteredTools = computed(() => filterToolList(keyword.value))

function onSearchChange() {
  // 由 computed 自动响应 keyword
}

/** 跳转统一工具详情页，携带工具 ID */
function goToolDetail(toolId) {
  uni.navigateTo({
    url: `/pages/tool/detail?id=${toolId}`,
  })
}

// #ifdef H5
/** H5：复制链接或使用 Web Share API */
function shareOnH5() {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  if (navigator.share) {
    navigator
      .share({
        title: '前端极客工具箱',
        text: '图片压缩、JSON 格式化、转盘、灵感骰子',
        url,
      })
      .catch(() => {})
  } else {
    uni.setClipboardData({
      data: url || '前端极客工具箱',
      success: () => {
        uni.showToast({ title: '链接已复制', icon: 'success' })
      },
    })
  }
}
// #endif

// #ifdef APP-PLUS
/** App：调用 uni.share 原生分享 */
function shareOnApp() {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: '前端极客工具箱',
    summary: '图片压缩、JSON 格式化、随机转盘、灵感骰子',
    success: () => {
      uni.showToast({ title: '分享成功', icon: 'success' })
    },
    fail: () => {
      uni.showModal({
        title: '分享',
        content: '请确保已配置分享 SDK，或使用系统分享能力。',
        showCancel: false,
      })
    },
  })
}
// #endif
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: $bg-color;
}

.search-wrap {
  margin-bottom: 32rpx;
}

.grid-wrap {
  background: $surface-color;
  border-radius: 16rpx;
  padding: 16rpx 0;
  border: 1rpx solid $border-color;
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 16rpx;
}

.tool-icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.tool-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-color;
  margin-bottom: 8rpx;
}

.tool-desc {
  font-size: 24rpx;
  color: $text-tertiary;
}

.empty-tip {
  text-align: center;
  padding: 48rpx;
  color: $text-tertiary;
  font-size: 28rpx;
}

.share-section {
  margin-top: 48rpx;
  display: flex;
  justify-content: center;
}
</style>
