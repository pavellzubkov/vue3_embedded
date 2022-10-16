<template>
  <router-view />
</template>

<script lang="ts" setup>
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { RouterService } from '@/router/RouterServiceClass'

console.log('AppMain created')
RouterService.setAcessibleRoutes([])
provide(/* key */ 'decoder', /* value */ J1939decoder)
</script>

<style lang="scss">
body {
  margin: 0;
}
body::-webkit-scrollbar {
  display: none;
}
</style>
