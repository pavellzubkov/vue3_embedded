<template>
  <div style="margin-top: 30px">
    <div v-for="pgn in allPgns" :key="pgn._id">
      <PgnOneC :pgn="pgn"></PgnOneC>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'

const allPgns = J1939decoder.allPgns
</script>

<style scoped></style>
