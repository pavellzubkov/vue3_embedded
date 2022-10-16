<template>
  <MyDialogC>
    <template #trigger>
      <MyIconC icon="List" tooltip="Подробнее" class="icon-button update-but"></MyIconC>
    </template>
    <template #content>
      <PgnsInfoC></PgnsInfoC>
    </template>
  </MyDialogC>
</template>

<script lang="ts" setup>
const dialogVisible = ref(false)
const switchDialog = () => {
  dialogVisible.value = !dialogVisible.value
}
</script>

<style scoped></style>
