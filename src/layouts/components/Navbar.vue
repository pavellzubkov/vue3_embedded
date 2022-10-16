<template>
  <div class="w3-bar">
    <MyIconC icon="List" class="w3-bar-item icon-button" tooltip="Меню" size="default" @click="Layout.toggleSidebar()"></MyIconC>
    <JNavBarButsC class="w3-bar-item padding-0"></JNavBarButsC>
    <div class="w3-bar-item w3-right padding-0">
      <SwitchDarkModeC class="w3-bar-item w3-margin-right"></SwitchDarkModeC>
      <GoFullScreenButC class="w3-bar-item w3-right"></GoFullScreenButC>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SwitchDarkModeC from '@/layouts/components/SwitchDarkModeC.vue'
import { Layout } from '@/layouts/LayoutClass'
</script>
