<template>
  <MyDialogC>
    <template #trigger>
      <MyIconC icon="Menu" tooltip="Подробнее..." class="icon-button" size="small"></MyIconC>
    </template>
    <template #content>
      <SpnDescriptionC class="w3-container" :spn_id="spn_id" :with-pgn-link="withPgnLink"></SpnDescriptionC>
    </template>
  </MyDialogC>
</template>

<script lang="ts" setup>
const props = defineProps({
  spn_id: {
    type: String,
    required: true
  },
  withPgnLink: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped></style>
