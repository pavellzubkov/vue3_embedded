<template>
  <div class="w3-card-2 w3-hover-shadow w3-border-theme w3-border w3-round-medium w3-padding-small">
    <div class="w3-bar">
      <span class="w3-bar-item w3-padding-small">
        {{ pgn.lid }}
      </span>
      <span class="w3-bar-item padding-2"> ({{ pgn.srsAdr }}) </span>
      <PgnOneInfoButC :pgn-id="pgn._id" class="w3-bar-item padding-2"></PgnOneInfoButC>
      <PgnBlinkDotC :blink="blink" class="w3-bar-item w3-padding-small"></PgnBlinkDotC>
      <div class="w3-bar-item padding-2 w3-right" style="display: inline-grid">
        <span class="fill-content-dots">
          {{ dataStr }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IJ1939PgnPrint } from '@/components/j1939/DecodeJ1939MessClass'
import { buf2hex } from '@/utils/transformArray'
import type { PropType, Ref } from 'vue'
import { computed } from 'vue'
const props = defineProps({
  pgn: {
    type: Object as PropType<IJ1939PgnPrint>,
    required: true
  }
})
const blink: Ref<boolean> = ref(false)

watch(
  () => props.pgn,
  () => {
    blink.value = !blink.value
    //console.log('pgn cha')
  }
)

const dataStr = computed(() => {
  return buf2hex(props.pgn.d.value)
})
</script>

<style scoped></style>
