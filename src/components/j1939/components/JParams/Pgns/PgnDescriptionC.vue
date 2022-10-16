<template>
  <div v-if="visible">
    <div v-if="pgnTemplate" class="w3-card">
      <label class="w3-bar-item padding-2">{{ pgnTemplate.short }}</label>
      <div class="w3-bar">
        <label class="w3-bar-item padding-2" style="font-size: 16px; font-weight: bold">Получен от устройства: </label>
        <label class="w3-bar-item padding-2">{{ srcAdr }} ({{ fromEcuAlias }})</label>
      </div>
      <div class="w3-bar">
        <label class="w3-bar-item padding-2" style="font-size: 16px; font-weight: bold">Название: </label>
        <span class="w3-bar-item description-value padding-2"> {{ nameText }}</span>
      </div>
      <div class="w3-bar">
        <label class="w3-bar-item padding-2" style="font-size: 16px; font-weight: bold">Значение: </label>
        <label class="w3-bar-item padding-2 description-value">{{ dataStr }}</label>
      </div>
      <div class="w3-bar">
        <label class="w3-bar-item padding-2" style="font-size: 16px; font-weight: bold">Перевод: </label>
        <LangSelectSwitchC class="w3-bar-item padding-2"></LangSelectSwitchC>
      </div>
      <div class="w3-bar">
        <label class="w3-bar-item padding-2" style="font-size: 16px; font-weight: bold">Описание: </label>
        <label class="w3-bar-item padding-2 description-value">{{ pgnDescr }}</label>
      </div>
      <label class="padding-2" style="font-size: 16px; font-weight: bold">Параметры в группе: </label>
      <div class="params-list">
        <SpnOneC v-for="spn in containsSpns" :key="spn._id" :spn="spn"></SpnOneC>
      </div>
    </div>
    <span v-else>Нет информации</span>
  </div>
</template>

<script lang="ts" setup>
import type { IJ1939TemplatePgn } from '@/components/j1939/components/Files/Shemas/decoderData'
import type { IJ1939SpnPrint } from '@/components/j1939/DecodeJ1939MessClass'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { buf2hex } from '@/utils/transformArray'
import { computed, Ref } from 'vue'

const props = defineProps({
  pgnId: {
    type: String,
    required: true
  }
})

const visible = ref(false)
const pgnTemplate: Ref<IJ1939TemplatePgn | undefined> = ref()
const containsSpns: Ref<IJ1939SpnPrint[]> = ref([])
const includesSpns: Ref<number[]> = ref([])
const srcAdr = props.pgnId.split('_')[0]

const fromEcuAlias = J1939decoder.availableEcus.value.find((item) => item.srcAdr.toString() === srcAdr)?.alias || ''

const dataStr = computed(() => {
  const val = J1939decoder.allPgns.value.find((d) => d._id === props.pgnId)?.d.value
  if (!val) return ''
  // console.log('data str computed', val)
  return buf2hex(val)
})

const nameText = computed(() => (J1939decoder.langIsRu.value ? pgnTemplate.value?.name_ru : pgnTemplate.value?.name_en))
const pgnDescr = computed(() => (J1939decoder.langIsRu.value ? pgnTemplate.value?.descr_ru : pgnTemplate.value?.descr_en))

//

onMounted(async () => {
  pgnTemplate.value = await J1939decoder.getPgnTemplate(props.pgnId)
  if (!pgnTemplate.value) return

  includesSpns.value = pgnTemplate.value.spns.map((spn) => spn.SPNd) || []
  containsSpns.value = J1939decoder.allSpns.value.filter((spn) => includesSpns.value.includes(spn.id))

  visible.value = true
})
</script>

<style scoped></style>
