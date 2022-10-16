<template>
  <div>
    <MyDialogC>
      <template #trigger>
        <MyIconC :icon="connectionIcon" :style="iconColorStyle" class="icon-button" tooltip="Соединение подробнее" @click="switchDialog"></MyIconC>
      </template>
      <template #content>
        <JConnectionStatusInfoC></JConnectionStatusInfoC>
      </template>
    </MyDialogC>
  </div>
</template>

<script lang="ts" setup>
import { FakeJ1939 } from '@/components/j1939/components/FakeMessages/FakeJ1939Class'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import type { IRegisteredIconsNames } from '@/components/UICommon/Icons/registerGlobIcons'
import { GlobStateInst } from '@/GlobStateClass'
import type { ComputedRef, Ref } from 'vue'

const dialogVisible = ref(false)

const connectionIcon: Ref<IRegisteredIconsNames> = computed((): IRegisteredIconsNames => {
  return J1939decoder.isConnected.value ? 'ConnectOk' : 'ConnectFail'
})

const iconColorStyle: ComputedRef<string> = computed(() => {
  let color = '#7d7d7f'
  if (!J1939decoder.isConnected.value) return `color: ${color}`
  color = J1939decoder.isFakedStream.value ? '#f8ad62' : '#5caf09'
  console.log('JConStatBut iconColorStyle ')
  return `color: ${color}`
})

function switchDialog() {
  dialogVisible.value = !dialogVisible.value
}

onMounted(async () => {
  await J1939decoder.updateAllFiles()
  if (GlobStateInst.fakeGenIsEnabled.value) FakeJ1939.start()
})
</script>

<style scoped></style>
