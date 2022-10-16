<template>
  <div class="w3-dropdown-click" ref="dropdown">
    <div @click="toggleVis">
      <slot name="trigger"></slot>
    </div>
    <transition
      appear
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
      mode="out-in"
    >
      <div
        v-if="dropVisible"
        class="w3-dropdown-content w3-bar-block w3-border w3-card-4 w3-show w3-padding-small w3-round-medium animate__faster w3-theme"
      >
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: () => false
  }
})

const dropVisible = ref(false)
const dropdown = ref()
const toggleVis = () => {
  if (!props.disabled) dropVisible.value = !dropVisible.value
}

onClickOutside(dropdown, () => {
  dropVisible.value = false
})
defineExpose({ toggleVis })
</script>

<style scoped></style>
