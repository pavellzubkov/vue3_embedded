<template>
  <div style="height: 70vh">
    <div class="w3-container">
      <div class="w3-row w3-margin-top">
        <MySwitchC v-model="fObj.showNumbVals" label="Показывать байтовые" class="w3-left"></MySwitchC>
      </div>
      <div class="w3-row w3-margin-top">
        <MySwitchC v-model="fObj.showBitsVals" label="Показывать битовые" class="w3-left"></MySwitchC>
      </div>
      <div class="w3-row w3-margin-top">
        <MySwitchC v-model="fObj.showEdgeVals" label="Параметры вне предела" class="w3-left"></MySwitchC>
      </div>
      <div class="w3-row w3-margin-top">
        <FilterSourcesSelectC v-model="fObj.infilterEcuAdrs" class="w3-left"></FilterSourcesSelectC>
      </div>
      <div class="w3-row w3-margin-top">
        <GroupsSelectButC class="w3-left"></GroupsSelectButC>
      </div>
      <!--        <GroupsSelectC class="w3-display-left"></GroupsSelectC>-->
    </div>
  </div>
</template>

<script lang="ts" setup>
import FilterSourcesSelectC from '@/components/j1939/components/JParams/Filter/FilterSourcesSelectC.vue'
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
const fObj = FilterSpns.filterObj
watch(
  fObj.value,
  () => {
    J1939decoder.resetAllSpns()
  },
  { deep: true }
)
</script>

<style scoped></style>
