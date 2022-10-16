<template>
  <div class="w3-card-2 w3-round w3-bar-block">
    <span class="w3-bar-item">Версия: {{ app_version }}</span>
    <span class="w3-bar-item">Автор: pavellzubkov@yandex.ru</span>
  </div>
</template>

<script lang="ts" setup>
import { app_version } from '@/AAAConfig/GlobConf'
</script>
