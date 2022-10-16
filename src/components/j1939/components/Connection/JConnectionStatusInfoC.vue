<template>
  <div>
    <div class="w3-bar">
      <div class="w3-bar-item">
        <FakeSwitchC :hide-switch="hideGenSwitch"></FakeSwitchC>
      </div>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">Websocket: </label>
      <span class="description-value w3-bar-item" :style="`color:var(${socketStatusColor})`"> {{ socketStatus }}</span>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">J1939: </label>
      <span class="w3-bar-item description-value" :style="jstatusColor"> {{ isConnected }}</span>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">Сообщения: </label>
      <span class="w3-bar-item description-value"> {{ counter }}</span>
      <div class="w3-bar-item w3-padding-small">
        <MyIconC icon="Update" tooltip="Сбросить" class="icon-button" @click="resetCounter"></MyIconC>
      </div>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">Передающиx ECU: </label>
      <span class="w3-bar-item description-value"> {{ availableECUsLength }}</span>
      <MyIconC icon="Update" tooltip="Сбросить" class="icon-button w3-bar-item w3-padding-small" @click="resetEcuList"></MyIconC>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">Групп параметров PGN: </label>
      <span class="w3-bar-item description-value"> {{ pgnsLength }}</span>
      <PgnsInfoButC class="w3-bar-item w3-padding-small"></PgnsInfoButC>
      <MyIconC icon="Update" tooltip="Сбросить" class="icon-button w3-bar-item w3-padding-small" @click="resetAllPgns"></MyIconC>
    </div>
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">Параметров SPN: </label>
      <span class="w3-bar-item description-value"> {{ spnsLength }}</span>
      <MyIconC icon="List" tooltip="Показать..." class="icon-button w3-bar-item w3-padding-small" @click="goToMainPage"></MyIconC>
      <MyIconC icon="Update" tooltip="Сбросить" class="icon-button w3-bar-item w3-padding-small" @click="resetAllSpns"></MyIconC>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { WebSocketInst } from '@/AAConnections/WebsClass'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { RouterService } from '@/router/RouterServiceClass'
import { computed, ComputedRef } from 'vue'

const socketStatus = WebSocketInst.wsStatus
const isConnected = computed(() => (J1939decoder.isConnected.value ? 'OK' : 'FAIL'))
const counter = J1939decoder.messageCounter
const socketStatusColor = computed(() => {
  switch (socketStatus.value) {
    case 'CLOSED':
      return '--color-alarm'
    case 'OPEN':
      return '--color-ok'
    default:
      return '--color-info'
  }
})
const jstatusColor = computed(() => {
  return isConnected.value ? 'color:var(--color-ok)' : 'color:var(--color-alarm)'
})
// const wsIsConnecting: ComputedRef<boolean> = computed(() => {
//   return socketStatus.value !== 'OPEN'
// })
const hideGenSwitch: ComputedRef<boolean> = computed(() => {
  return socketStatus.value == 'OPEN' && J1939decoder.isConnected.value && !J1939decoder.isFakedStream.value
})
const availableECUsLength = computed(() => J1939decoder.availableEcus.value.length)
const pgnsLength = computed(() => J1939decoder.allPgns.value.length)
const spnsLength = computed(() => J1939decoder.allSpns.value.length)
const resetCounter = J1939decoder.resetMessageCounter
const resetEcuList = J1939decoder.resetEcusList
const resetAllPgns = J1939decoder.resetAllPgns
const resetAllSpns = J1939decoder.resetAllSpns
const goToMainPage = () => {
  if (RouterService.goToName) RouterService.goToName('J1939')
}
</script>

<style scoped lang="scss"></style>
