<template>
  <div class="w3-card-2">
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">Перевод: </label>
      <LangSelectSwitchC class="w3-bar-item"></LangSelectSwitchC>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">SPN(параметр): {{ err.SPN }}</label>
      <span class="w3-bar-item description-value"> {{ descrSPN }} </span>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">FMI(причина): {{ err.FMI }}</label>
      <label class="w3-bar-item description-value">{{ descrFMI }}</label>
    </div>
    <div class="w3-bar" v-if="isStored">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">OCC(зарегистрировано раз): {{ err.OCC }}</label>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">Получено от устройства: </label>
      <label class="w3-bar-item description-value">{{ err.SRC }} ({{ fromEcuAlias }})</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IJ1939ErrorPrint } from '@/components/j1939/components/ErrCodes/DecodeJ1939Errors'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import type { PropType } from 'vue'

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

const fromEcuAlias = J1939decoder.availableEcus.value.find((item) => item.srcAdr == props.err.SRC)?.alias || ''
const descrSPN = computed(() => (J1939decoder.langIsRu.value ? props.err.description.spn.name_ru : props.err.description.spn.name_en))
const descrFMI = computed(() => (J1939decoder.langIsRu.value ? props.err.description.fmi.name_ru : props.err.description.fmi.name_en))
</script>
