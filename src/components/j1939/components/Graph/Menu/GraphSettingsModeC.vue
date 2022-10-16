<template>
  <div style="height: 80px">
    <div style="display: inline-flex">
      <label style="margin-right: 8px"> Всё </label>
      <MyTooltipC text="Режим графика.">
        <MySwitchC v-model="isWindow" />
      </MyTooltipC>
      <label> Период </label>
    </div>
    <zoom-trans-c>
      <div v-if="isWindow">
        <label>Ширина периода</label>
        <input v-model="wiInterval" step="30" min="30" max="600" inputmode="numeric" type="number" style="margin-left: 8px" class="w3-round-small" />
      </div>
    </zoom-trans-c>
  </div>
</template>

<script lang="ts" setup>
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
import ZoomTransC from '@/components/UICommon/ZoomTransC.vue'
import { watchDebounced } from '@vueuse/core'

const isWindow = GraphData.graphIsWindow

const wiInterval = ref(GraphData.windowIntervalSec.value)

watchDebounced(
  wiInterval,
  () => {
    console.log('changed!')
    if (wiInterval.value < 30) wiInterval.value = 30
    if (wiInterval.value > 600) wiInterval.value = 600
    GraphData.windowIntervalSec.value = wiInterval.value
  },
  { debounce: 2000, maxWait: 4000 }
)
</script>

<style scoped></style>
