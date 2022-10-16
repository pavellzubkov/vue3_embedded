<template>
  <h5>Выбор параметра</h5>

  <div style="display: inline-flex">
    <div style="display: inline-flex; padding-top: 4px">
      <label style="margin-right: 8px">Текущие</label>
      <MySwitchC v-model="selectionType"></MySwitchC>
      <label>Номер</label>
    </div>

    <div style="margin-bottom: 6px; margin-left: 6px">
      <transition appear enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut" mode="out-in">
        <MyIconC
          v-if="selected.length > 0"
          icon="Checked"
          tooltip=""
          with-badge
          :badge-text="selected.length.toString()"
          badge-type="warn"
          :badge-right-proc="-20"
          class="icon-button"
          style="color: var(--color-ok); cursor: pointer; margin-left: 8px"
          @click="ok"
        ></MyIconC>
      </transition>
    </div>
  </div>

  <SpnDataAllC v-if="!selectionType" is-select list-heiht="60vh"></SpnDataAllC>
  <SpnsSelectNumbC v-else v-model="FilterSpns.selectedSpns.value"></SpnsSelectNumbC>
</template>

<script lang="ts" setup>
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'

const selectionType = ref(false)
const selected = FilterSpns.selectedSpns
const emit = defineEmits(['selected'])
const ok = () => {
  emit('selected', [...FilterSpns.selectedSpns.value])
}
</script>
