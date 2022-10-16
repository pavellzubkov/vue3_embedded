<template>
  <div :class="`w3-panel w3-theme-badge-${notif.type} w3-card-4 w3-display-container w3-round-medium`" style="z-index: 100000; min-width: 300px">
    <button class="w3-button w3-round-large w3-display-topright w3-hover-shadow w3-hover-opacity" @click="del">X</button>
    <h5>{{ notif.title }}</h5>
    <span>{{ notif.text }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { INotificationFull } from '@/components/UICommon/Notifications/NotificationsClass'
import { Notifications } from '@/components/UICommon/Notifications/NotificationsClass'
import type { PropType } from 'vue'

const props = defineProps({
  notif: {
    type: Object as PropType<INotificationFull>,
    default: () => null
  }
})
const del = () => {
  Notifications.deleteNotifi(props.notif?.id)
}
</script>

<style scoped></style>
