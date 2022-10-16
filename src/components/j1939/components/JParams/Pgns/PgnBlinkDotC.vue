<template>
  <span class="my-blink-dot" :style="blinkBkg"></span>
</template>

<script lang="ts" setup>
const props = defineProps({
  blink: {
    type: Boolean,
    requided: true
  }
})

const blinkBkg = ref('')

watch(
  () => props.blink,
  () => {
    const green = '#11b139'
    const grey = '#7d7d7f'
    // blink = !blink
    blinkBkg.value = `background-color: ${props.blink ? green : grey}`
  }
)
</script>

<style scoped></style>
