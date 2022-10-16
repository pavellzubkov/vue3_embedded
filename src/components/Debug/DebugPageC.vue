<template>
  <MyIconsSetC class="w3-left-align"></MyIconsSetC>
  <div class="w3-bar-block">
    <span>{{ app_version }}</span>
    <span class="w3-bar-item">{{ `WsStatus - ${WebSocketInst.wsStatus.value}` }}</span>
    <span class="w3-bar-item">WsMessages - {{ WebSocketInst.messCount }}</span>
  </div>

  <div v-if="isSupported && memory" class="inline-grid grid-cols-2 gap-x-4 gap-y-2">
    <template v-if="memory">
      <div>Used</div>
      <div>{{ size(memory.usedJSHeapSize) }}</div>
      <div>Allocated</div>
      <div>{{ size(memory.totalJSHeapSize) }}</div>
      <div>Limit</div>
      <div>{{ size(memory.jsHeapSizeLimit) }}</div>
    </template>
  </div>
  <div v-else>Your browser does not support performance memory API</div>
</template>

<script lang="ts" setup>
import { app_version } from '@/AAAConfig/GlobConf'
import { WebSocketInst } from '@/AAConnections/WebsClass'
import { useMemory } from '@vueuse/core'

console.log('Debug created routes calc')

const size = (v: number) => {
  const kb = v / 1024 / 1024
  return `${kb.toFixed(2)} MB`
}
const { isSupported, memory } = useMemory()
</script>

<style scoped></style>
