<template>
  <div class="w3-dropdown-click" ref="content">
    <div @click="toggleVis" style="position: relative">
      <slot name="trigget"></slot>
    </div>
    <transition
      appear
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
      mode="out-in"
    >
      <div
        v-if="vis"
        class="w3-dropdown-content w3-card w3-round w3-show animate__faster w3-theme-l4"
        style="height: 180px; width: 200px; overflow-y: auto; overflow-x: hidden"
      >
        <slot name="options" class="w3-bar w3-bar-block"> </slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'

const vis = ref(false)
const content = ref()
const toggleVis = () => {
  vis.value = !vis.value
}
onClickOutside(content, (event) => {
  vis.value = false
})
defineExpose({ toggleVis })
</script>

<!--<style scoped></style>-->
