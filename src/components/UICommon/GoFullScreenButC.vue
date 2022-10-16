<template>
  <div>
    <MyIconC :icon="icon" :tooltip="isFullscreen ? 'Свернуть' : 'На весь экран'" class="icon-button" @click="toggle"> </MyIconC>
  </div>
</template>

<script lang="ts" setup>
import type { IRegisteredIconsNames } from '@/components/UICommon/Icons/registerGlobIcons'
import { useFullscreen } from '@vueuse/core'
import type { ComputedRef, PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  el: {
    type: Object as PropType<HTMLElement | null>,
    default: null
  }
})

console.log('gofull created ', props)
const { isFullscreen, enter, exit, toggle } = useFullscreen(props.el)
const icon: ComputedRef<IRegisteredIconsNames> = computed((): IRegisteredIconsNames => (isFullscreen.value ? 'FullScreenMin' : 'FullScreenMax'))
</script>

<style scoped>
.full-screen-size {
  width: 30px;
  height: 30px;
  font-size: 30px;
}
</style>
