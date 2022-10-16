<template>
  <router-view v-slot="{ Component }" :key="currentRoute.fullPath">
    <transition appear enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut" mode="out-in">
      <keep-alive :max="1">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
const currentRoute = useRoute()
</script>
