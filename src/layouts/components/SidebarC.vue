<template>
  <transition
    name="flip-list"
    tag="div"
    enter-active-class="animate__animated animate__slideInLeft"
    leave-active-class="animate__animated animate__slideOutLeft"
  >
    <div
      v-if="!isClosed"
      ref="sidebar"
      class="w3-sidebar w3-light-grey w3-bar-block animate__faster w3-card-4"
      style="width: var(--side-menu-expanded-width); background-color: var(--color-bg)"
    >
      <SidebarLogoC class="w3-theme" />
      <AppMenuC></AppMenuC>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import AppMenuC from '@/layouts/components/Menu/AppMenu/AppMenuC.vue'
import SidebarLogoC from '@/layouts/components/Menu/AppMenu/SidebarLogoC.vue'
import { Layout } from '@/layouts/LayoutClass'
import { onClickOutside } from '@vueuse/core'

const sidebar = ref()

const isClosed = Layout.isSidebarCollapsed

onClickOutside(sidebar, (event) => {
  if (!isClosed.value) Layout.toggleSidebar()
})
</script>

<style scoped></style>
