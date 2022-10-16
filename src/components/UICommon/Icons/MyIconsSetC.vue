<template>
  <div class="grid-auto" style="grid-template-columns: repeat(auto-fill, minmax(30px, 1fr))">
    <MyIconC
      v-for="icon in allIcons"
      :key="icon"
      class="icon-size-default icon-button"
      :icon="icon"
      @click="copyIconEl(icon)"
      :tooltip="icon"
    ></MyIconC>
  </div>
</template>

<script lang="ts">
import { IRegisteredIconsNames, _RegisteredIcons } from '@/components/UICommon/Icons/registerGlobIcons'
import { Notifications } from '@/components/UICommon/Notifications/NotificationsClass'
import { useClipboard } from '@vueuse/core'

export default {
  name: 'MyIconsSetC',

  setup() {
    const allIcons = Object.keys(_RegisteredIcons) as IRegisteredIconsNames[]
    const { copy } = useClipboard()
    const copyIconEl = (iconName: IRegisteredIconsNames) => {
      copy(`<my-icon-c icon="${iconName}" tooltip=""></my-icon-c>`)
      Notifications.showNotify({
        type: 'ok',
        duration_ms: 1500,
        title: 'Ok',
        text: 'Скопировано в буфер'
      })
    }
    return {
      allIcons,
      copyIconEl
    }
  }
}
</script>

<style scoped></style>
