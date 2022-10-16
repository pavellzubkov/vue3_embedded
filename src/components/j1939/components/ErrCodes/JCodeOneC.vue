<template>
  <div class="w3-card-2 w3-border-theme w3-border w3-round-medium w3-padding-small card-common" :style="bgStyle">
    <div style="display: inline-flex">
      <JErrDescriptionButC :err="errObj" :is-stored="isStored"></JErrDescriptionButC>
      <label style="margin-left: 6px">SPN - {{ errObj.SPN }}</label>
      <label style="margin-left: 6px"> FMI - {{ errObj.FMI }}</label>
      <label style="margin-left: 6px"> Источник - {{ errObj.SRC }} ({{ fromEcuAlias }})</label>
      <label v-if="isStored" style="margin-left: 6px">OCC - {{ errObj.OCC }}</label>
    </div>
    <div style="display: inline-grid">
      <span class="err-name">{{ descrSpn }} {{ descrFmi }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IJ1939ErrorPrint } from '@/components/j1939/components/ErrCodes/DecodeJ1939Errors'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import type { PropType } from 'vue'
import { computed } from 'vue'
const props = defineProps({
  errObj: {
    type: Object as PropType<IJ1939ErrorPrint>,
    required: true
  },
  isStored: {
    type: Boolean,
    default: false
  }
})

const bgStyle = computed(() => {
  return props.errObj.active.value ? 'background-color: var(--color-warning)' : 'background-color: var(--color-info)'
})
const fromEcuAlias = computed(() => J1939decoder.getEcuAlias(props.errObj.SRC))
const descrSpn = computed(() =>
  J1939decoder.ErrorsDecoder.langSelect.value ? props.errObj.description.spn.name_ru : props.errObj.description.spn.name_en
)
const descrFmi = computed(() =>
  J1939decoder.ErrorsDecoder.langSelect.value ? props.errObj.description.fmi.name_ru : props.errObj.description.fmi.name_en
)
</script>

<style scoped>
.err-name {
  white-space: nowrap; /* Запрещаем перенос строк */
  overflow: hidden; /* Обрезаем все, что не помещается в область */
  padding: var(--app-contaiter-margin); /* Поля вокруг текста */
  text-overflow: ellipsis; /* Добавляем многоточие */
}
</style>
