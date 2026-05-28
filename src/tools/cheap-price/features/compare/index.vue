<template>
  <view class="panel">
    <view class="block">
      <text class="label">商品名称</text>
      <uv-input
        v-model="keyword"
        placeholder="如：iPhone 15、戴森吸尘器"
        border="surround"
        clearable
      />
      <text class="label">商品编码（可选）</text>
      <uv-input
        v-model="productCode"
        placeholder="SKU / 型号，便于精确匹配"
        border="surround"
        clearable
      />
      <text class="label">比价平台</text>
      <view class="platform-row">
        <view
          v-for="p in platforms"
          :key="p.id"
          class="platform-chip"
          :class="{ on: selectedPlatforms.includes(p.id) }"
          @click="togglePlatform(p.id)"
        >
          <text>{{ p.name }}</text>
        </view>
      </view>
      <uv-button
        type="primary"
        text="开始比价"
        :color="theme.primary"
        :loading="loading"
        @click="search"
      />
      <text class="hint">{{ statusHint }}</text>
    </view>

    <template v-if="searched && offers.length">
      <RecommendCard :data="recommendation" />

      <view class="block">
        <text class="section-title">价格排序（低到高）</text>
        <view class="offer-list">
          <OfferListItem
            v-for="(item, index) in offers"
            :key="item.id"
            :offer="item"
            :rank="index + 1"
            :active="selectedOfferId === item.id"
            @select="selectOffer(item.id)"
          />
        </view>
      </view>

      <PriceHistoryPanel
        :history="selectedOffer?.history"
        :data-source="dataSource"
        :show-empty="dataSource === 'juhe'"
      />
    </template>

    <view v-else-if="searched" class="empty">未找到匹配商品，请换个关键词</view>
  </view>
</template>

<script setup>
import { PALETTE } from '@/styles/palette.js'
import { usePriceCompare } from '../../composables/usePriceCompare'
import RecommendCard from '../../components/RecommendCard.vue'
import OfferListItem from '../../components/OfferListItem.vue'
import PriceHistoryPanel from '../../components/PriceHistoryPanel.vue'

const theme = PALETTE

const {
  keyword,
  productCode,
  platforms,
  selectedPlatforms,
  loading,
  searched,
  offers,
  selectedOfferId,
  recommendation,
  selectedOffer,
  dataSource,
  statusHint,
  togglePlatform,
  search,
  selectOffer,
} = usePriceCompare()
</script>

<style lang="scss" scoped>
@import '@/styles/palette.scss';

.panel {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.block {
  background: $palette-surface;
  border: 1rpx solid $palette-border;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.label {
  font-size: 24rpx;
  font-weight: 600;
  color: $palette-text-secondary;
}

.section-title {
  font-size: 26rpx;
  font-weight: 600;
  color: $palette-text-secondary;
  display: block;
  margin-bottom: 8rpx;
}

.platform-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.platform-chip {
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  border: 2rpx solid $palette-border;
  background: $palette-surface-muted;
  font-size: 26rpx;
  color: $palette-text-secondary;

  &.on {
    border-color: $palette-primary;
    background: $palette-primary-soft;
    color: $palette-primary;
    font-weight: 600;
  }
}

.hint {
  font-size: 22rpx;
  color: $palette-text-tertiary;
  line-height: 1.5;
}

.offer-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.empty {
  text-align: center;
  padding: 48rpx;
  font-size: 26rpx;
  color: $palette-text-tertiary;
}
</style>
