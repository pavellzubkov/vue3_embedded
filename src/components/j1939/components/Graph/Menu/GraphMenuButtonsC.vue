<template>
  <div class="w3-bar">
    <GraphSettingsButC class="w3-bar-item"></GraphSettingsButC>
    <ZoomTransC class="w3-bar-item">
      <GraphStartStopButC v-if="graphListExist"></GraphStartStopButC>
    </ZoomTransC>

    <MyIconC
      :icon="icon"
      :tooltip="isGraphFull ? 'Свернуть' : 'На весь экран'"
      class="icon-size-default icon-button w3-bar-item w3-right"
      @click="graphToFull"
    >
    </MyIconC>
  </div>
</template>

<script lang="ts" setup>
import type { ChartClass } from '@/components/j1939/components/Graph/Chart/ChartClass'
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
import type { IRegisteredIconsNames } from '@/components/UICommon/Icons/registerGlobIcons'
import { useFullscreen } from '@vueuse/core'
import type { PropType } from 'vue'
import { computed, ComputedRef } from 'vue'

const props = defineProps({
  el: {
    type: Object as PropType<HTMLElement>,
    default: null
  },
  grInst: {
    type: Object as PropType<ChartClass>,
    required: true
  }
})

const { isFullscreen, enter, exit, toggle } = useFullscreen(props.el)
const isGraphFull = props.grInst.isFullScreen
const icon: ComputedRef<IRegisteredIconsNames> = computed((): IRegisteredIconsNames => (isGraphFull.value ? 'FullScreenMin' : 'FullScreenMax'))
const graphListExist = GraphData.isListNotEmpty
const graphToFull = () => {
  if (isFullscreen.value) {
    if (!isGraphFull.value) {
      exit()
      isGraphFull.value = true
      enter()
      console.log('graph full togle')
      return
    } else {
      exit()
      isGraphFull.value = false
      return
    }
  }
  isGraphFull.value = !isGraphFull.value
  toggle()
}
</script>

<style scoped></style>
