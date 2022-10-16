<template>
  <transition appear enter-active-class="animate__animated animate__bounceIn" leave-active-class="animate__animated animate__bounceOut" mode="out-in">
    <div v-if="vis" class="w3-bar">
      <label class="w3-bar-item w3-padding-small" style="font-size: 16px; font-weight: bold">Генератор фейковых сообщений: </label>
      <MySwitchC class="w3-bar-item" v-model="val"></MySwitchC>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { FakeJ1939 } from '@/components/j1939/components/FakeMessages/FakeJ1939Class'
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { GlobStateInst } from '@/GlobStateClass'
import { ref, watch } from 'vue'

const props = defineProps({
  hideSwitch: {
    type: Boolean,
    required: true
  }
})

const val = GlobStateInst.fakeGenIsEnabled
let timeoutId
const vis = ref(!props.hideSwitch)

watch(
  () => val.value,
  () => {
    J1939decoder.resetAll()
    if (val.value) {
      FakeJ1939.start()
    } else {
      FakeJ1939.stop()
    }
  }
)
// const chg = computed(() => {
//   return !J1939decoder.isConnected.value || J1939decoder.isFakedStream.value
// })

watch(
  () => props.hideSwitch,
  () => {
    if (props.hideSwitch) {
      clearTimeout(timeoutId)
      timeoutId = null
      vis.value = false
    } else {
      GraphData.stop()
      timeoutId = setTimeout(() => {
        vis.value = true
      }, 4000)
    }
  }
)
onUnmounted(() => clearTimeout(timeoutId))
</script>

<style scoped></style>
