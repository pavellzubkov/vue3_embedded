<template>
  <MyDialogC ref="dialog">
    <template #trigger>
      <MyIconC
        :icon="type === 'add' ? 'Plus' : 'List'"
        :tooltip="type === 'add' ? 'Добавить' : ''"
        size="small"
        class="icon-button w3-right"
        style="color: #3a3a3a"
        tooltip-pos-vert="bottom"
        tooltip-pos-hor="left"
      ></MyIconC>
    </template>
    <template #content>
      <GroupAddEditC @edited="edited" @delete="del" :type="type" :group="group"></GroupAddEditC>
    </template>
  </MyDialogC>
</template>

<script lang="ts" setup>
import { FilterSpns, IJFilterSpnsGroup } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import { Notifications } from '@/components/UICommon/Notifications/NotificationsClass'
import { PropType } from 'vue'

const dialog = ref()
const props = defineProps({
  type: {
    type: String as PropType<'add' | 'edit'>,
    default: () => 'add'
  },
  group: {
    type: Object as PropType<IJFilterSpnsGroup>
  }
})
const edited = (gr: IJFilterSpnsGroup) => {
  if (gr.oldName) delete gr.oldName
  const groupIndex = FilterSpns.filterSpnsGroups.value.findIndex((g) => g.name === gr.name)
  if (groupIndex > -1) {
    FilterSpns.filterSpnsGroups.value[groupIndex] = gr
  } else {
    FilterSpns.filterSpnsGroups.value.unshift(gr)
  }
  Notifications.showNotify({
    type: 'ok',
    duration_ms: 1500,
    title: 'Ok',
    text: 'Успешно'
  })
  dialog.value.closeModal()
}

const del = (gr: IJFilterSpnsGroup) => {
  const ind = FilterSpns.filterSpnsGroups.value.findIndex((group) => group.name === gr.name)
  FilterSpns.filterSpnsGroups.value.splice(ind, 1)
  dialog.value.closeModal()
}
</script>

<style scoped></style>
