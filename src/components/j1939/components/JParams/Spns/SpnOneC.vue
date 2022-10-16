<template>
  <div class="w3-card-2 w3-hover-shadow w3-border-theme w3-border w3-round-medium w3-padding-small card-common">
    <div style="display: inline-flex">
      <input v-if="isSelect" class="w3-check w3-theme" type="checkbox" v-model="selected" @change="selChanged" />
      <SpnDescriptionButC v-else class="w3-bar-item w3-padding-small" style="width: 30px" :spn_id="spn._id" :with-pgn-link="withPgnLink">
      </SpnDescriptionButC>
      <div class="w3-bar-item w3-padding-small" style="display: inline-grid">
        <span class="w3-text-theme fill-content-dots">{{ spnName }}</span>
      </div>
      <SpnGoToButC
        v-if="!isSelect"
        class="w3-padding-small"
        tooltip="Есть на графике"
        icon="LineGraphIn"
        color-var="--color-info-blue"
        route-name="JGraph"
        :trigger="inGraphSPNIdInd > -1"
      ></SpnGoToButC>
      <SpnGoToButC
        v-if="!isSelect"
        class="w3-padding-small"
        :tooltip="inErrTooltip"
        icon="CodesActive"
        color-var="--color-alarm"
        route-name="JActiveCodes"
        :trigger="inErrVis"
      ></SpnGoToButC>
    </div>

    <div class="w3-row">
      <div class="w3-card w3-margin-left w3-round padding-2" :style="`display: inline-grid; background-color: #${unitColor}40`">
        <label class="fill-content-dots" style="font-weight: bold"> {{ valueString }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IJ1939ErrorPrint } from '@/components/j1939/components/ErrCodes/DecodeJ1939Errors'
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import type { IJ1939SpnPrint } from '@/components/j1939/DecodeJ1939MessClass'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { useArrayFindIndex, useIntervalFn, watchDebounced } from '@vueuse/core'
import type { PropType, Ref } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  spn: {
    type: Object as PropType<IJ1939SpnPrint>,
    required: true
  },
  withPgnLink: {
    type: Boolean,
    default: false
  },
  isSelect: {
    type: Boolean,
    default: () => false
  }
})
// console.log('SpnOne Created')
const valueString = ref('')

const { isOutOfBound, value } = toRefs(props.spn)
const unitColor: Ref<string> = ref('')
const selected = computed(() => {
  return FilterSpns.selectedSpns.value.findIndex((n) => n === props.spn.id) > -1
})

const selChanged = (e: Event) => {
  const t = e.target as HTMLInputElement
  console.log('selchanged ', t.checked)
  if (t.checked) {
    FilterSpns.selectedSpns.value.push(props.spn.id)
  } else {
    const i = FilterSpns.selectedSpns.value.findIndex((n) => n === props.spn.id)
    FilterSpns.selectedSpns.value.splice(i, 1)
  }
}

const inErr: Ref<IJ1939ErrorPrint | undefined> = ref()
const { pause } = useIntervalFn(
  () => {
    inErr.value = J1939decoder.ErrorsDecoder.activeErrorsArr.value.find((el) => {
      // console.log('SpnOne in Err computed')
      const erSpnId = J1939decoder.ErrorsDecoder.getSpnIdFromErr(el)
      return erSpnId === props.spn._id
    })
  },
  1000,
  { immediate: true }
)

const spnName = computed(() => (J1939decoder.langIsRu.value ? props.spn.name_ru : props.spn.name))

watchDebounced(
  value,
  () => {
    // console.log('changed! ', Object.keys(J1939decoder.unitsColorsObj.value))
    valueString.value = `${value.value} ${props.spn.unit || ''}`
    unitColor.value = J1939decoder.unitsColorsObj.value[props.spn.unit || 'str']
  },
  { debounce: 200, maxWait: 500, immediate: true }
)

const inErrVis = computed(() => {
  // console.log('inErr computed')
  return !!inErr.value
})
const inErrTooltip = computed(() => {
  if (!inErr.value) return ''
  if (!inErr.value?.description) return `FMI -${inErr.value?.FMI}`
  return J1939decoder.ErrorsDecoder.langSelect.value ? inErr.value?.description.fmi.name_ru : inErr.value?.description.fmi.name_en
})
const inGraphSPNIdInd = useArrayFindIndex(GraphData.spnsInGraphIds, (spnId) => {
  // console.log('inGraphSPNIdInd computed')
  return spnId === props.spn._id
})
onUnmounted(() => pause())
</script>

<style lang="scss">
.border-spn {
  border: #7d7d7f;
  border-radius: 5px;
}
.lighted-card {
  height: 80px;
  background-color: var(--color-card-alarm);
}
.card-common {
  background-color: var(--color-card-param);
  margin: 4px;
  height: 80px;
}

.card-thin {
  background-color: var(--color-info);
  margin: 4px;
  height: 60px;
}

.spn-label {
  margin-left: 20px;
  font-weight: bold;
}
</style>
