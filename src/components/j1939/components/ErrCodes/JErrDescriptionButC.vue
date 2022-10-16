<template>
  <div>
    <MyDialogC animate-direction="right">
      <template #trigger>
        <MyIconC icon="Menu" tooltip="Подробнее..." class="icon-button" size="small"> </MyIconC>
      </template>
      <template #content>
        <JErrDescriptionC :err="err" :is-stored="isStored"></JErrDescriptionC>
      </template>
    </MyDialogC>
  </div>
</template>

<script lang="ts" setup>
import type { IJ1939ErrorPrint } from '@/components/j1939/components/ErrCodes/DecodeJ1939Errors'
import { PropType } from 'vue'

const props = defineProps({
  err: {
    type: Object as PropType<IJ1939ErrorPrint>,
    required: true
  },
  isStored: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped></style>
