<template>
  <view class="tool-shell">
    <!-- 工具说明区（可扩展 badge、版本等） -->
    <view v-if="showHeader" class="tool-shell__header">
      <text class="tool-shell__title">{{ manifest.name }}</text>
      <text v-if="manifest.desc" class="tool-shell__desc">{{ manifest.desc }}</text>
      <text class="tool-shell__version">v{{ manifest.version }}</text>
    </view>

    <!-- 多子功能时展示 Tab 切换 -->
    <view v-if="tabList.length > 1" class="tool-shell__tabs">
      <view
        v-for="tab in tabList"
        :key="tab.id"
        class="tool-shell__tab"
        :class="{ active: activeFeatureId === tab.id }"
        @click="switchFeature(tab.id)"
      >
        <text>{{ tab.name }}</text>
      </view>
    </view>

    <!-- 当前子功能面板 -->
    <view class="tool-shell__body">
      <component :is="activeFeatureComponent" v-if="activeFeatureComponent" />
    </view>

    <!-- 底部扩展插槽：各工具 index 可传入操作栏 -->
    <view v-if="$slots.footer" class="tool-shell__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, provide, shallowRef, watch } from 'vue'
import { TOOL_CONTEXT_KEY } from '@/tools/core/useToolContext'

const props = defineProps({
  /** defineToolManifest 返回的清单对象 */
  manifest: {
    type: Object,
    required: true,
  },
  /** 是否显示顶部标题区 */
  showHeader: {
    type: Boolean,
    default: true,
  },
  /** 路由参数，可指定默认子功能 feature=id */
  routeQuery: {
    type: Object,
    default: () => ({}),
  },
})

const tabList = computed(() =>
  (props.manifest.features || []).map((f) => ({
    id: f.id,
    name: f.name,
    icon: f.icon,
  }))
)

const activeFeatureId = ref(
  props.routeQuery.feature ||
    props.manifest.defaultFeatureId ||
    tabList.value[0]?.id ||
    ''
)

const activeFeatureComponent = shallowRef(null)

function resolveFeatureComponent(featureId) {
  const feature = props.manifest.features?.find((f) => f.id === featureId)
  return feature?.component || null
}

function switchFeature(id) {
  if (activeFeatureId.value === id) return
  activeFeatureId.value = id
  activeFeatureComponent.value = resolveFeatureComponent(id)
}

watch(
  () => props.manifest.id,
  () => {
    const initial =
      props.routeQuery.feature ||
      props.manifest.defaultFeatureId ||
      tabList.value[0]?.id
    activeFeatureId.value = initial
    activeFeatureComponent.value = resolveFeatureComponent(initial)
  },
  { immediate: true }
)

/** 向子功能面板注入工具上下文，便于共享状态、切换 Tab */
provide(TOOL_CONTEXT_KEY, {
  get toolId() {
    return props.manifest.id
  },
  get manifest() {
    return props.manifest
  },
  activeFeatureId,
  switchFeature,
})
</script>

<style lang="scss" scoped>
.tool-shell {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.tool-shell__header {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
}

.tool-shell__title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  display: block;
}

.tool-shell__desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.tool-shell__version {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.tool-shell__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  background: #fff;
  padding: 16rpx;
  border-radius: 12rpx;
}

.tool-shell__tab {
  padding: 12rpx 28rpx;
  border-radius: 32rpx;
  background: #f0f2f5;
  font-size: 26rpx;
  color: #666;

  &.active {
    background: #2979ff;
    color: #fff;
  }
}

.tool-shell__body {
  min-height: 200rpx;
}

.tool-shell__footer {
  padding-top: 8rpx;
}
</style>
