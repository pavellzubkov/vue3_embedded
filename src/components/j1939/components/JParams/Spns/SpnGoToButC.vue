<template>
  <transition
    appear
    enter-active-class="animate__animated animate__bounceInLeft"
    leave-active-class="animate__animated animate__bounceOutRight"
    mode="out-in"
  >
    <MyIconC
      v-if="trig.trigger.value"
      :icon="trig.icon.value"
      :tooltip="trig.tooltip.value"
      class="icon-size-default"
      :style="`color: var(${trig.colorVar.value}); cursor: pointer`"
      @click="goToName()"
    ></MyIconC>
  </transition>
</template>

<script lang="ts" setup>
import type { IRegisteredIconsNames } from '@/components/UICommon/Icons/registerGlobIcons'
import type { IRouteNames } from '@/router'
import { RouterService } from '@/router/RouterServiceClass'
import type { PropType } from 'vue'

const props = defineProps({
  trigger: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String as PropType<IRegisteredIconsNames>,
    required: true
  },
  routeName: {
    type: String as PropType<IRouteNames>,
    required: true
  },
  tooltip: {
    type: String,
    required: true
  },
  colorVar: {
    type: String,
    required: true
  }
})
const trig = toRefs(props)

function goToName() {
  RouterService.goToName(props.routeName)
}
</script>

<style scoped></style>
