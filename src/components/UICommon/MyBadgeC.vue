<template>
  <div>
    <div
      v-if="badgeText !== '●'"
      :class="`w3-badge w3-tiny w3-round-xxlarge w3-theme-badge-${badgeType} ${badgeIsButton ? 'icon-button' : ''}`"
      :style="`position: absolute; right: ${textRightProc}%; top: ${textTopProc}%`"
    >
      {{ badgeText }}
    </div>
    <div v-if="badgeIsDot" class="w3-badge w3-large badge-is-dot" style="position: absolute; right: -15%; top: -30%">
      {{ badgeText }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
  badgeIsDot: {
    type: Boolean,
    default: false
  },
  badgeIsButton: {
    type: Boolean,
    default: false
  },
  badgeText: {
    type: String,
    default: '●'
  },
  badgeType: {
    type: String as PropType<'alarm' | 'warn' | 'ok' | 'info'>,
    default: 'alarm'
  },
  textRightProc: {
    type: Number,
    default: -2
  },
  textTopProc: {
    type: Number,
    default: 2
  }
})
</script>

<style scoped></style>
