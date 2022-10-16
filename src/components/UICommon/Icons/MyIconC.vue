<template>
  <MyTooltipC style="position: relative; display: flex" :text="tooltip" :position-vert="tooltipPosVert" :position-hor="tooltipPosHor">
    <component :is="icon" :class="`${iconSizeClass}`"> </component>
    <MyBadgeC
      :badge-is-dot="badgeIsDot"
      :badge-text="badgeText"
      :badge-type="badgeType"
      :text-right-proc="badgeRightProc"
      :text-top-proc="badgeTopProc"
    ></MyBadgeC>
    <slot class="w3-badge w3-large" style="position: absolute; right: -2%; top: -30%"></slot>
  </MyTooltipC>
</template>

<script lang="ts" setup>
import type { IRegisteredIconsNames } from '@/components/UICommon/Icons/registerGlobIcons'
import MyBadgeC from '@/components/UICommon/MyBadgeC.vue'
import type { IColorType } from '@/layouts/LayoutClass'
import type { PropType } from 'vue'

const props = defineProps({
  icon: {
    type: String as PropType<IRegisteredIconsNames>,
    required: true
  },
  tooltip: {
    type: String,
    default: ''
  },
  withBadge: {
    type: Boolean,
    default: false
  },
  badgeIsDot: {
    type: Boolean,
    default: false
  },
  badgeText: {
    type: String,
    default: '●'
  },
  badgeType: {
    type: String as PropType<IColorType>,
    default: 'alarm'
  },
  badgeRightProc: {
    type: Number,
    default: -2
  },
  badgeTopProc: {
    type: Number,
    default: 2
  },
  size: {
    type: String as PropType<'small' | 'tiny' | 'default'>,
    default: 'default'
  },
  tooltipPosVert: {
    type: String as PropType<'top' | 'bottom' | 'not' | 'auto'>,
    default: () => 'auto'
  },
  tooltipPosHor: {
    type: String as PropType<'left' | 'right' | 'not' | 'auto'>,
    default: () => 'auto'
  }
})
const iconSizeClass = `icon-size-${props.size}`
</script>
