<template>
  <div>
    <MyDialogC animate-direction="left">
      <template #trigger>
        <MyIconC icon="Filter" :badge-is-dot="!dotHidden" tooltip="Фильтр" class="icon-button" @click="dialogVisible = !dialogVisible"></MyIconC>
      </template>
      <template #content>
        <FilterSpnsFormC></FilterSpnsFormC>
      </template>
    </MyDialogC>
  </div>
</template>

<script lang="ts" setup>
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import { objectIsEqual } from '@/utils/transformArray'
import { computed, ref } from 'vue'

const dialogVisible = ref(false)
const dotHidden = computed(() => {
  console.log('dotHidden filter computed ', FilterSpns.defaultFilter, FilterSpns.filterObj.value)
  return objectIsEqual(FilterSpns.defaultFilter, FilterSpns.filterObj.value)
})
</script>

<style scoped></style>
