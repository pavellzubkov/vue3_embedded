<template>
  <div class="padding-2" style="overflow-x: clip">
    <h6>Создать группу</h6>
    <input class="w3-input w3-border w3-round padding-2" style="width: 130px" type="text" placeholder="Название группы" v-model="groupName" />
    <div>
      <label>Параметры: </label>
      <GroupSpnsTagsC @selected="selected"></GroupSpnsTagsC>
    </div>
    <transition-group
      name="flip-list"
      enter-active-class="animate__animated animate__bounceInRight"
      leave-active-class="animate__animated animate__bounceOutRight"
    >
      <button v-if="groupIsOk" class="w3-button w3-theme-badge-ok w3-round-large w3-right w3-margin" @click="sendGroup">Ok</button>
    </transition-group>
    <transition-group
      name="flip-list"
      enter-active-class="animate__animated animate__bounceInRight"
      leave-active-class="animate__animated animate__bounceOutRight"
    >
      <button v-if="groupExist" class="w3-button w3-theme-badge-alarm w3-round-large w3-right w3-margin" @click="deleteGroup">Удалить</button>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import type { IJFilterSpnsGroup } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import type { PropType, Ref } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'add' | 'edit'>,
    default: () => 'add'
  },
  group: {
    type: Object as PropType<IJFilterSpnsGroup>,
    default: null
  }
})
const groupName = ref(props.group?.name || '')
const spns: Ref<number[]> = ref([])
const emit = defineEmits(['edited', 'delete'])
const groupIsOk = computed(() => {
  return groupName.value.length > 0 && spns.value.length > 0
})
const groupExist = computed(() => {
  const ind = FilterSpns.filterSpnsGroups.value.findIndex((gr) => gr.name === groupName.value)
  return ind > -1
})

const sendGroup = () => {
  const nGr: IJFilterSpnsGroup = {
    name: groupName.value,
    oldName: props.group?.name,
    spns: spns.value,
    selected: false
  }
  emit('edited', nGr)
}
const deleteGroup = () => {
  const nGr: IJFilterSpnsGroup = {
    name: groupName.value,
    oldName: props.group?.name,
    spns: spns.value,
    selected: false
  }
  emit('delete', nGr)
}

const selected = (arr: number[]) => {
  console.log('GroupAddEdit selected f ', arr)
  spns.value = arr
}

if (props.type === 'edit' && props.group) {
  FilterSpns.selectedSpns.value = props.group.spns
} else {
  FilterSpns.selectedSpns.value = []
}
</script>

<style scoped></style>
