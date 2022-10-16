<template>
  <MyDialogC ref="dialog" :disabled="modalDisabled">
    <template #trigger>
      <div v-if="spnD" ref="spnTag" class="w3-tag w3-xlarge w3-round-medium w3-theme-tag w3-hover-shadow" style="cursor: pointer; position: relative">
        {{ spnD }}
        <MyBadgeC
          v-if="isHovered"
          badge-type="alarm"
          badge-is-button
          badge-text="X"
          :text-top-proc="-10"
          :text-right-proc="-10"
          class="w3-large"
          @click="deleteSpn"
        ></MyBadgeC>
      </div>
    </template>
    <template #content>
      <div>
        <button class="w3-button w3-round-xxlarge" style="background-color: var(--color-alarm)" @click="deleteSpn">X</button>
        <SpnDescriptionC :spn_id="`0_${spnD}`" :with-data="false"></SpnDescriptionC>
      </div>
    </template>
  </MyDialogC>
</template>

<script lang="ts" setup>
import { useElementHover } from '@vueuse/core'
import type { Ref } from 'vue'

const props = defineProps({
  spnD: {
    type: Number,
    required: true
  }
})
const dialog = ref()
const emit = defineEmits(['deleted'])
const spnTag = ref()
const modalDisabled: Ref<boolean> = ref(false)
const isHovered = useElementHover(spnTag)
const deleteSpn = () => {
  modalDisabled.value = true
  console.log('delete spn clicked')
  dialog.value.closeModal()
  emit('deleted', props.spnD)
}
</script>

<style scoped></style>
