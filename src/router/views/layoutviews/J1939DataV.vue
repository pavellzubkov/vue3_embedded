<template>
  <SpnDataAllC :list-heiht="listHeight"></SpnDataAllC>
</template>

<script lang="ts" setup>
import { Layout } from '@/layouts/LayoutClass'

const listHeight = computed(() => {
  if (Layout.isDeviceMobile.value && Layout.isFullscreen.value) return '85vh'
  if (Layout.isDeviceMobile.value) return '72vh'
  return '85vh'
})
</script>

<style scoped></style>
