<template>
  <div
    class="w3-container"
    style="display: inline-flex; align-items: center; height: var(--nav-bar-height); width: 100%; cursor: pointer"
    @click="goToMainPage"
  >
    <MyIconC icon="Engine" class="w3-bar-item" style="width: 60px"></MyIconC>
    <h4 style="padding-top: 5px">
      {{ state.title }}
    </h4>
  </div>
</template>

<script lang="ts" setup>
import { RouterService } from '@/router/RouterServiceClass'
import { onMounted } from 'vue'

const state = reactive({
  logo: 'd',
  title: 'JScan'
})

const goToMainPage = () => {
  if (RouterService.goToName) RouterService.goToName('J1939')
}

onMounted(async () => {
  console.log('Logo log on mounted')
})
</script>
