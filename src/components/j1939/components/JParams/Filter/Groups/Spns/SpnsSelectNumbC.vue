<template>
  <textarea class="w3-input" type="text" v-model="str" />
</template>

<script lang="ts" setup>
import { useVModel, watchDebounced } from '@vueuse/core'
import type { PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<number[]>,
    reqired: true,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])

const numbArray = useVModel(props, 'modelValue', emit)
const str = ref(numbArray.value.join(','))
const calcStr = () => {
  const NumpRegexp = /([0-9]*)/gm
  const arr = str.value
    .match(NumpRegexp)
    ?.filter((e) => e !== '')
    .map((e) => Number.parseInt(e))
  console.log('Inp changed ', arr)
  if (arr) {
    str.value = arr.join(',')
    numbArray.value = [...new Set(arr)]
  }
}

watchDebounced(str, calcStr, { debounce: 1000, maxWait: 5000 })
console.log('SpnsSelectNumb created ', props.modelValue)
</script>
