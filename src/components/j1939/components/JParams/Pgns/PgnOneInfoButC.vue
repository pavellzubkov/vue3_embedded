<template>
  <div v-if="visible">
    <MyDialogC>
      <template #trigger>
        <span class="w3-hover-grayscale icon-button w3-hover-text-theme w3-text-theme-ok" @click="switchDialog()"
          >({{ pgnTemplate.short || '?' }})</span
        >
      </template>
      <template #content>
        <PgnDescriptionC v-if="dialogVisible" :pgnId="pgnId"></PgnDescriptionC>
      </template>
    </MyDialogC>
  </div>
</template>

<script lang="ts" setup>
import type { IJ1939TemplatePgn } from '@/components/j1939/components/Files/Shemas/decoderData'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import type { Ref } from 'vue'

const props = defineProps({
  pgnId: {
    type: String,
    required: true
  }
})
console.log('PgnOneInfo created pgnId ', props.pgnId)
const visible = ref(false)
const dialogVisible = ref(false)
const switchDialog = () => {
  dialogVisible.value = !dialogVisible.value
}
const pgnTemplate: Ref<IJ1939TemplatePgn | undefined> = ref()
onMounted(async () => {
  pgnTemplate.value = await J1939decoder.getPgnTemplate(props.pgnId)
  if (pgnTemplate.value && pgnTemplate.value?.short) {
    visible.value = true
  }
})
</script>

<style scoped></style>
