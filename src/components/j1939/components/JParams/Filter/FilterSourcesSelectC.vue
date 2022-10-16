<template>
  <MySelectC ref="select">
    <template #trigget>
      <button class="w3-button w3-border w3-round padding-2">{{ butText }}</button>
      <MyBadgeC :badge-text="badgeText" :text-right-proc="-20" :text-top-proc="-20" :badge-type="badgeType"></MyBadgeC>
    </template>
    <template #options>
      <ul class="w3-ul w3-hover-border-theme" style="min-width: 180px">
        <li v-for="ecu in availableEcus" :key="ecu.srcAdr" class="w3-display-container w3-border-0 w3-margin">
          <div class="w3-display-left">
            <input class="w3-check w3-theme" type="checkbox" v-model="ecu.selected" @change="change(ecu)" />
            <label class="w3-padding-small">{{ ecu.srcAdr }} ({{ ecu.alias }})</label>
          </div>
        </li>
      </ul>
    </template>
  </MySelectC>
</template>

<script lang="ts" setup>
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { useVModel } from '@vueuse/core'
import type { ComputedRef, PropType, Ref } from 'vue'
const props = defineProps({
  modelValue: {
    type: Array as PropType<number[]>,
    reqired: true,
    default: () => []
  },
  butText: {
    type: String,
    default: () => 'Источники'
  },
  onlyOne: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])
const arr = useVModel(props, 'modelValue', emit)
const badgeType: Ref<'alarm' | 'warn' | 'ok'> = ref('alarm')
const select = ref()
const availableEcus = computed(() => {
  return J1939decoder.availableEcus.value.map((e) => {
    e.selected = arr.value.findIndex((r) => r === e.srcAdr) !== -1
    return e
  })
})
const badgeText: ComputedRef<string> = computed(() => {
  let out = 'все'
  badgeType.value = 'ok'
  const length = availableEcus.value.filter((e) => e.selected).length
  if (length === 0) return out
  if (length === availableEcus.value.length) return out

  out = length.toString()
  badgeType.value = 'warn'
  return out
})
const change = (ecu) => {
  const selected = availableEcus.value.filter((e) => e.selected)
  console.log('filter change', ecu)
  if (!props.onlyOne) {
    arr.value = selected.map((e) => e.srcAdr)
    return
  }
  if (ecu.selected) {
    if (selected.length != 1) {
      availableEcus.value.forEach((e) => {
        e.selected = e.srcAdr === ecu.srcAdr
      })
    }
    arr.value = [ecu.srcAdr]
    select.value.toggleVis()
    return
  }
  arr.value = []
  select.value.toggleVis()
}
</script>

<style scoped></style>
