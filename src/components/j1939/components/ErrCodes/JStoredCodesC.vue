<template>
  <div>
    <JCodeReqClearButC is-req @startReq="reqExecuted = true" @stopReq="reqExecuted = false"></JCodeReqClearButC>
    <JCodeReqClearButC style="margin-left: 6px" @startReq="reqExecuted = true" @stopReq="reqExecuted = false"></JCodeReqClearButC>
    <div>
      <MyLoaderC v-if="reqExecuted" />
      <JCodeOneC v-else v-for="item in errsArr" :key="item._id" is-stored v-bind:err-obj="item"></JCodeOneC>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { J1939decoder } from '../../DecodeJ1939MessClass'

const lang = J1939decoder.ErrorsDecoder.langSelect
const errsArr = J1939decoder.ErrorsDecoder.storeErrorsArr
const reqExecuted = ref(false)
</script>

<style scoped></style>
