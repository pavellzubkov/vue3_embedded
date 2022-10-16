<template>
  <div>
    <GroupAddEditButC></GroupAddEditButC>
    <div style="width: 100%; height: 100%; overflow-x: clip; padding-top: 20px">
      <GroupOneC v-for="group in groups" :key="group.name" style="width: 100%" :group="group"></GroupOneC>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'

const groups = FilterSpns.filterSpnsGroups
</script>
