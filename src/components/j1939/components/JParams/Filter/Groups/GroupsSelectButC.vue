<template>
  <MySelectC>
    <template #trigget>
      <button class="w3-button w3-border padding-2 w3-round-medium">Группы</button>
      <MyBadgeC :badge-text="badgeText" :text-right-proc="-20" :text-top-proc="-20" :badge-type="badgeType"></MyBadgeC>
    </template>
    <template #options>
      <GroupsAllC></GroupsAllC>
    </template>
  </MySelectC>
</template>

<script lang="ts" setup>
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import { ComputedRef, Ref } from 'vue'

const badgeType: Ref<'alarm' | 'warn' | 'ok' | 'info'> = ref('info')
const badgeText: ComputedRef<string> = computed(() => {
  let out = 'нет'
  badgeType.value = 'info'
  const selectedNames = FilterSpns.filterSpnsGroups.value.filter((e) => e.selected).map((e) => e.name)
  if (selectedNames.length === 0) return out
  badgeType.value = 'warn'
  out = selectedNames.length.toString()

  return out
})
</script>
