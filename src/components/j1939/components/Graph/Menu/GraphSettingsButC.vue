<template>
  <MyDialogC>
    <template #trigger>
      <MyIconC icon="Settings" class="icon-size-default btn-5 app-container" tooltip="Настройки..."></MyIconC>
    </template>
    <template #content>
      <GraphSettingsC></GraphSettingsC>
    </template>
  </MyDialogC>
</template>

<script lang="ts" setup></script>
