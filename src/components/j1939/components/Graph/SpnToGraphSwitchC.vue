<template>
  <MySwitchC v-model="value1"></MySwitchC>
</template>

<script lang="ts" setup>
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
import { ref, watch } from 'vue'

const props = defineProps({
  spn_id: {
    type: String,
    required: true
  }
})

const value1 = ref(GraphData.spnIdExistInList(props.spn_id))
watch(
  () => value1.value,
  () => {
    GraphData.addDeleteSpnId(props.spn_id, value1.value)
  }
)
</script>

<style scoped></style>
