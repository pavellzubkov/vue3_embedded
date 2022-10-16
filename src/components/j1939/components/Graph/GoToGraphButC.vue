<template>
  <transition
    appear
    enter-active-class="animate__animated animate__slideInDown"
    leave-active-class="animate__animated animate__slideOutUp"
    mode="out-in"
  >
    <div v-if="graphListExist">
      <MyIconC class="icon-button" @click="RouterService.goToName('JGraph')" with-badge icon="LineGraph" tooltip="Перейти к графику">
        <component :is="icon" class="icon-graph-nest" :style="`color: ${nestIconColor}`"></component>
      </MyIconC>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
import type { IRegisteredIconsNames } from '@/components/UICommon/Icons/registerGlobIcons'
import { RouterService } from '@/router/RouterServiceClass'
import { computed, ComputedRef } from 'vue'

const graphListExist = GraphData.isListNotEmpty
const icon: ComputedRef<IRegisteredIconsNames> = computed((): IRegisteredIconsNames => (GraphData.isDatastart.value ? 'Play' : 'Pause'))
const nestIconColor = computed(() => (GraphData.isDatastart.value ? '#11b139' : '#113eb1'))
</script>

<style scoped>
.icon-graph-nest {
  position: absolute;
  left: 17px;
  top: -2px;
}
</style>
