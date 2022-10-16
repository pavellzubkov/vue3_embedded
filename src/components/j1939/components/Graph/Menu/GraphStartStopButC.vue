<template>
  <MyIconC
    :icon="icon"
    :tooltip="GraphData.isDatastart.value ? 'Пауза' : 'Пуск'"
    class="icon-size-default btn-5 app-container"
    @click="toggleDataRec"
  ></MyIconC>
</template>

<script lang="ts" setup>
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
import type { IRegisteredIconsNames } from '@/components/UICommon/Icons/registerGlobIcons'
import { computed, ComputedRef } from 'vue'

const icon: ComputedRef<IRegisteredIconsNames> = computed((): IRegisteredIconsNames => (GraphData.isDatastart.value ? 'Pause' : 'Play'))
const toggleDataRec = () => {
  if (GraphData.isDatastart.value) {
    GraphData.stop()
  } else {
    GraphData.start()
  }
}
</script>

<style scoped></style>
