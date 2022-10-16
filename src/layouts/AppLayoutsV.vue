<template>
  <NotificationsC></NotificationsC>
  <SidebarC></SidebarC>
  <Navbar class="w3-theme" :style="`height: var(--nav-bar-height);${blurStyle}`"> </Navbar>
  <div class="app-container" :style="blurStyle">
    <AppMainV></AppMainV>
  </div>
</template>

<script lang="ts" setup>
import AppMainV from '@/layouts/AppMainV.vue'
import Navbar from '@/layouts/components/Navbar.vue'
import SidebarC from '@/layouts/components/SidebarC.vue'
import { Layout } from '@/layouts/LayoutClass'

const blurStyle = computed(() => {
  return Layout.isSidebarCollapsed.value ? '' : 'filter: blur(5px)'
})

watch(
  () => Layout.viewRect.value,
  () => null
)
</script>
