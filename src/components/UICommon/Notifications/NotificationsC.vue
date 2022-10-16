<template>
  <div class="w3-display-container w3-bar-block">
    <div class="w3-display-topright">
      <transition-group
        name="flip-list"
        tag="div"
        enter-active-class="animate__animated animate__slideInDown"
        leave-active-class="animate__animated animate__slideOutRight"
      >
        <NotifiOneC v-for="notify in notifyList" :key="notify.id" :notif="notify" class="animate__faster"></NotifiOneC>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Notifications } from '@/components/UICommon/Notifications/NotificationsClass'

const notifyList = Notifications.notificationList
</script>

<style scoped></style>
