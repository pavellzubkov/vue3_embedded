<template>
  <div ref="hintEl" :aria-label="text" role="tooltip" title="b" @click="removeClasses">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { Layout } from '@/layouts/LayoutClass'
import { useElementHover } from '@vueuse/core'
import type { PropType } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: () => ''
  },
  positionVert: {
    type: String as PropType<'top' | 'bottom' | 'not' | 'auto'>,
    default: () => 'auto'
  },
  positionHor: {
    type: String as PropType<'left' | 'right' | 'not' | 'auto'>,
    default: () => 'auto'
  }
})
const position = ref('')
const hintEl = ref()
const isHovered = useElementHover(hintEl)
function removeClassByPrefix(el, prefix) {
  const regx = new RegExp('\\b' + prefix + '.*?\\b', 'g')
  el.className = el.className.replace(regx, '')
  return el
}

const baseClasses = ['hint--rounded', 'hint--timeout', 'hint--bounce']
const removeClasses = (classes: string[]) => {
  if (!hintEl.value) return
  if (!Array.isArray(classes)) return
  console.log('removeClasses ', classes)
  hintEl.value.classList.remove(...classes)
}
watch(Layout.isDeviceMobile, () => {
  if (Layout.isDeviceMobile.value) {
    removeClassByPrefix(hintEl.value, 'hint--')
  } else {
    hintEl.value.classList.add(...baseClasses)
  }
})
watch(isHovered, () => {
  if (!hintEl.value) return
  if (props.text === '') return
  hintEl.value.removeAttribute('title')
  const rect: DOMRect = hintEl.value.getBoundingClientRect()
  // console.log('tooltip el hovered ', rect)
  if (Layout.isDeviceMobile.value) {
    removeClasses(baseClasses)
    return
  }
  if (isHovered.value) {
    baseClasses[3] = getPositionClass(rect)
    hintEl.value.classList.add(...baseClasses)
  } else {
    removeClasses([baseClasses[3]])
  }
})
const getAutoVert = (rect: DOMRect): string => {
  if (rect.y < 80) return '-bottom'
  if (Layout.scrH.value - rect.y < 80) return '-top'
  return '-bottom'
}
const getAutoHor = (rect: DOMRect): string => {
  if (rect.x < 80) return '-right'
  if (Layout.scrW.value - rect.x < 80) return '-left'
  return '-right'
}
const getPositionClass = (rect: DOMRect): string => {
  let vert = `-${props.positionVert}`
  if (props.positionVert === 'not') vert = ''
  if (props.positionVert === 'auto') vert = getAutoVert(rect)
  console.log('getPosition class vert - ', rect.y, Layout.scrH.value - rect.y)
  let hor = `-${props.positionHor}`
  if (props.positionHor === 'not') hor = ''
  if (props.positionHor === 'auto') hor = getAutoHor(rect)
  console.log('getPosition class hor - ', rect.x, Layout.scrW.value - rect.x)
  console.log('getPosition class ', `hint-${vert}${hor}`, ' all -', hintEl.value.classList)

  return `hint-${vert}${hor}`
}
onMounted(() => {
  if (props.text === '') return
  if (Layout.isDeviceMobile.value) return
  hintEl.value.classList.add(...baseClasses)
})
</script>

<style scoped></style>
