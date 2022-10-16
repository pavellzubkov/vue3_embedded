<template>
  <div>
    <transition-group
      name="flip-list"
      tag="div"
      enter-active-class="animate__animated animate__bounceInLeft"
      leave-active-class="animate__animated animate__bounceOutRight"
    >
      <JCodeOneC v-for="item in codesList" :key="item._id" :err-obj="item"></JCodeOneC>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
const codesList = J1939decoder.ErrorsDecoder.activeErrorsArr
</script>

<style scoped></style>
