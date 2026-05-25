<template>
  <ToolShell :manifest="manifest" :route-query="routeQuery" :show-header="false" />
</template>

<script setup>
import ToolShell from '@/components/tool-shell/ToolShell.vue'

defineProps({
  manifest: { type: Object, required: true },
  routeQuery: { type: Object, default: () => ({}) },
})
</script>
