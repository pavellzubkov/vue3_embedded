<template>
  <MySwitchC class="w3-bar-item" v-model="lang" onstring="RU" offstring="EN"></MySwitchC>
</template>

<script lang="ts" setup>
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { Layout } from '@/layouts/LayoutClass'

const lang = J1939decoder.langIsRu
const isMobile = Layout.isDeviceMobile
</script>

<style scoped></style>
