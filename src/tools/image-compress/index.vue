<template>
  <ToolShell :manifest="manifest" :route-query="routeQuery" />
</template>

<script setup>
import ToolShell from '@/components/tool-shell/ToolShell.vue'

defineProps({
  /** 由详情页注入，避免 manifest 与 index 循环引用 */
  manifest: {
    type: Object,
    required: true,
  },
  routeQuery: {
    type: Object,
    default: () => ({}),
  },
})
</script>
