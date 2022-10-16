<template>
  <div class="grid-auto">
    <transition-group name="flip-list" enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut">
      <GroupSpnOneTagC v-for="spnd in selected" :key="spnd" :spn-d="spnd" @deleted="deleteSpn" class="animate__faster"></GroupSpnOneTagC>
    </transition-group>
    <GroupSpnAddButC @selected="ev" class="w3-left"></GroupSpnAddButC>
  </div>
</template>

<script lang="ts" setup>
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import type { Ref } from 'vue'

const emit = defineEmits(['selected'])
const selected: Ref<number[]> = ref(FilterSpns.selectedSpns.value)
const ev = (ar: number[]) => {
  selected.value = [...ar]
  emit('selected', selected.value)
}
const deleteSpn = (spnD: number) => {
  const ind = selected.value.findIndex((c) => c === spnD)
  FilterSpns.selectedSpns.value.splice(ind, 1)
  selected.value.splice(ind, 1)
  emit('selected', selected.value)
}
</script>

<style scoped></style>
