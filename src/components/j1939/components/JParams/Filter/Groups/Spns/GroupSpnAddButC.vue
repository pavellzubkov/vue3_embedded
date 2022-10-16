<template>
  <MyDialogC ref="dialog">
    <template #trigger>
      <MyIconC icon="Plus" tooltip="Добавить.." size="default" class="icon-button" style="color: #3a3a3a"></MyIconC>
    </template>
    <template #content>
      <GroupSpnAddCard @selected="ev"></GroupSpnAddCard>
    </template>
  </MyDialogC>
</template>

<script lang="ts" setup>
const dialog = ref()
const emit = defineEmits(['selected'])
const selected = ref([])
const ev = (ar: number[]) => {
  dialog.value.closeModal()
  emit('selected', ar)
}
</script>

<style scoped></style>
