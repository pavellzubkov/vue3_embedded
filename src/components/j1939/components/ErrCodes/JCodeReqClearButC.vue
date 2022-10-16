<template>
  <MyDropDownC ref="dropdown" :disabled="dropdownDisabled">
    <template #trigger>
      <button class="w3-button w3-border w3-round-medium w3-hover-theme w3-padding-small" @click="butClick">
        {{ isReq ? `Запросить` : `Очистить` }}
      </button>
    </template>
    <template #content>
      <div class="w3-bar-block w3-padding-small">
        <FilterSourcesSelectC
          only-one
          v-model="selectedECU"
          class="w3-bar-item w3-padding-small"
          style="width: 80px"
          but-text="ECU"
        ></FilterSourcesSelectC>
        <button
          v-if="confirmButVis"
          class="w3-bar-item w3-button w3-circle w3-right w3-padding-small w3-border w3-center"
          style="width: 40px; background-color: var(--color-ok); color: var(--color-text)"
          @click="confirmEvent()"
        >
          Ок
        </button>
      </div>
    </template>
  </MyDropDownC>
</template>

<script lang="ts" setup>
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { useTimeoutPoll } from '@vueuse/core'
import { Ref, ref } from 'vue'

const emit = defineEmits(['stopReq', 'startReq'])
const props = defineProps({
  isReq: {
    type: Boolean,
    default: false
  }
})
const dropdown = ref()
const dropdownDisabled = computed(() => J1939decoder.availableEcus.value.length === 1)

const selectedECU: Ref<number[]> = ref([]) // J1939decoder.ErrorsDecoder.ecuSelected

const confirmButVis = computed(() => {
  console.log('selected Ecu ', selectedECU.value)
  return selectedECU.value.length === 1
})
const reqCount = ref(0)
const attempts = 3

const reqErr = function () {
  if (selectedECU.value.length !== 1) return
  reqCount.value++
  if (props.isReq) {
    J1939decoder.ErrorsDecoder.sendRequestErrors(selectedECU.value[0])
  } else {
    J1939decoder.ErrorsDecoder.sendClearErrors(selectedECU.value[0])
  }
  if (reqCount.value >= attempts) {
    if (props.isReq) {
      pause()
      emit('stopReq')
    } else {
      J1939decoder.ErrorsDecoder.sendRequestErrors(selectedECU.value[0])
      if (reqCount.value >= attempts + 3) {
        pause()
        emit('stopReq')
      }
    }
  }
}
const { pause, resume } = useTimeoutPoll(reqErr, 1000)

const confirmEvent = () => {
  reqCount.value = 0
  resume()
  console.log('JCodeReqClearButC confirmEvent -', selectedECU.value)
  dropdown.value.toggleVis()
  emit('startReq')
}

const butClick = () => {
  if (J1939decoder.availableEcus.value.length === 1) {
    selectedECU.value[0] = J1939decoder.availableEcus.value[0].srcAdr
    confirmEvent()
    return
  }

  console.log('JCodeReqClearButC butClick -', selectedECU.value)
}

onUnmounted(() => pause())
</script>

<style scoped></style>
