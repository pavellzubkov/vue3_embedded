<template>
  <div class="w3-row w3-border w3-round-small padding-2">
    <GroupAddEditButC type="edit" :group="group"></GroupAddEditButC>
    <input class="w3-check" type="checkbox" v-model="group.selected" @change="change" style="padding-top: 9px; width: 30px" />
    <span style="display: inline-block; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
      {{ group.name }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { IJFilterSpnsGroup } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import type { PropType } from 'vue'

const props = defineProps({
  group: {
    type: Object as PropType<IJFilterSpnsGroup>
  }
})
const change = () => {
  console.log('asdfasdfasdfas')
  // props.group.selected
}
</script>

<style scoped></style>
