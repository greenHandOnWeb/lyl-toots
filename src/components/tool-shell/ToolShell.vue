<template>
  <view class="tool-shell">
    <view v-if="showHeader" class="tool-shell__header">
      <text class="tool-shell__title">{{ manifest.name }}</text>
      <text v-if="manifest.desc" class="tool-shell__desc">{{ manifest.desc }}</text>
    </view>

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

    <view class="tool-shell__body">
      <component :is="activeFeatureComponent" v-if="activeFeatureComponent" />
    </view>

    <view v-if="$slots.footer" class="tool-shell__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, provide, shallowRef, watch } from 'vue'
import { TOOL_CONTEXT_KEY } from '@/tools/core/useToolContext'

const props = defineProps({
  manifest: {
    type: Object,
    required: true,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
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
@import '@/uni.scss';

.tool-shell {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.tool-shell__header {
  padding: 8rpx 4rpx 0;
}

.tool-shell__title {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-color;
  display: block;
}

.tool-shell__desc {
  font-size: 26rpx;
  color: $text-secondary;
  margin-top: 8rpx;
  display: block;
  line-height: 1.5;
}

.tool-shell__tabs {
  display: flex;
  gap: 32rpx;
  border-bottom: 2rpx solid $border-strong;
  padding: 0 4rpx;
}

.tool-shell__tab {
  padding: 16rpx 0 20rpx;
  font-size: 28rpx;
  color: $text-tertiary;
  position: relative;

  &.active {
    color: $primary-color;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2rpx;
      height: 6rpx;
      background: $primary-color;
      border-radius: 6rpx 6rpx 0 0;
    }
  }
}

.tool-shell__body {
  min-height: 200rpx;
}

.tool-shell__footer {
  padding-top: 8rpx;
}
</style>
