<template>
  <MyDialogC>
    <template #trigger>
      <MyIconC icon="Question" size="tiny" tooltip="Информация..." class="icon-button"></MyIconC>
    </template>
    <template #content>
      <span>{{ text }}</span>
      <span v-for="link in links" :key="link" class="w3-hover-theme icon-button" @click="copyUrl(link)">{{ link }}</span>
    </template>
  </MyDialogC>
</template>

<script lang="ts" setup>
import { RegexURLRegexp } from '@/AAAConfig/GlobConf'
import { Notifications } from '@/components/UICommon/Notifications/NotificationsClass'
import { useClipboard } from '@vueuse/core'

const props = defineProps({
  descriptionText: {
    type: String,
    default: () => ''
  }
})
const text = computed(() => props.descriptionText?.replace(RegexURLRegexp, ''))
const links = computed(() => props.descriptionText.match(RegexURLRegexp))

const { copy, isSupported } = useClipboard()
//const permissionRead = usePermission('clipboard-read')
const copyUrl = (url: string) => {
  if (!isSupported.value) return
  copy(url)
  Notifications.showNotify({
    type: 'ok',
    duration_ms: 1500,
    title: 'Ok',
    text: 'Скопировано в буфер'
  })
}

onMounted(() => {
  console.log(`descr but mounted ${props.descriptionText} text ${text.value} links ${links.value}`)
})
</script>

<style scoped></style>
