<template>
  <div class="w3-card" v-if="visible">
    <div class="w3-bar" style="width: 100%">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">Название: </label>
      <span class="w3-bar-item w3-padding-small"> {{ spnName }} ({{ spnId }})</span>
    </div>
    <div style="width: 100%" v-if="withData">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">Значение: </label>
      <label class="w3-bar-item w3-padding-small description-value">{{ spnFullValue }}</label>
    </div>
    <div class="w3-bar" style="width: 100%">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">Пределы: </label>
      <label class="w3-bar-item w3-padding-small description-value">{{ spnTemplate?.data_range }}</label>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">Перевод: </label>
      <LangSelectSwitchC class="w3-bar-item w3-padding-small"></LangSelectSwitchC>
    </div>

    <div class="w3-bar" v-if="withData">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">На график: </label>
      <SpnToGraphSwitchC class="w3-bar-item w3-padding-small" :spn_id="spnLId"></SpnToGraphSwitchC>
    </div>

    <div class="w3-bar">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">Описание: </label>
      <label class="w3-bar-item w3-padding-small">{{ spnDescr }}</label>
    </div>
    <div class="w3-bar" v-if="withData">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">Получен от устройства: </label>
      <label class="w3-bar-item w3-padding-small">{{ spnSrs }} ({{ fromEcuAlias }})</label>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">Входит в группу: </label>
      <PgnOneInfoButC class="w3-bar-item w3-padding-small" v-if="withPgnLink && parentPgn" :pgn-id="parentPgn?._id"></PgnOneInfoButC>
      <label class="w3-bar-item w3-padding-small" v-else>({{ parentPgnShortName }})</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IJ1939TemplatePgn, IJ1939TemplateSpn } from '@/components/j1939/components/Files/Shemas/decoderData'
import { DecodeJ1939MessClass, IJ1939PgnPrint } from '@/components/j1939/DecodeJ1939MessClass'
import { computed, Ref } from 'vue'

const props = defineProps({
  spn_id: {
    type: String,
    required: true
  },
  withPgnLink: {
    type: Boolean,
    default: false
  },
  withData: {
    type: Boolean,
    default: true
  }
})
const visible = ref(false)
const Decoder = inject('decoder') as DecodeJ1939MessClass
const SpnPrint = Decoder.getSpnPrint(props.spn_id)
const spnLId = SpnPrint._id

const spnId = SpnPrint.id
const spnSrs = SpnPrint.srsAdr

const spnFullValue = computed(() => `${SpnPrint.value.value} ${SpnPrint?.unit || ''}`)
const fromEcuAlias = Decoder.availableEcus.value.find((item) => item.srcAdr == SpnPrint.srsAdr)?.alias || ''

const spnTemplate: Ref<IJ1939TemplateSpn | undefined> = ref()
const pgnTemplate: Ref<IJ1939TemplatePgn | undefined> = ref()

const parentPgn: Ref<IJ1939PgnPrint | undefined> = ref()
const parentPgnShortName = ref('')
const spnName = computed(() => (Decoder.langIsRu.value ? SpnPrint.name_ru : SpnPrint.name))
const spnDescr = computed(() => (Decoder.langIsRu.value ? SpnPrint.discr_ru : SpnPrint.discr_en))

onMounted(async () => {
  spnTemplate.value = await Decoder.getSpnTemplate(SpnPrint.id)
  pgnTemplate.value = await Decoder.getPgnTemplate(spnTemplate.value?.PGNref || 999999)
  parentPgnShortName.value = pgnTemplate.value?.short || ''
  parentPgn.value = Decoder.allPgns.value.find((pgn) => pgn.lid === spnTemplate.value?.PGNref)
  visible.value = true
})
</script>
