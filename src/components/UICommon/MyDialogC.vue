<template>
  <div>
    <div @click="openModal">
      <slot name="trigger"></slot>
    </div>

    <div v-if="dialogVisible" ref="modal" class="w3-modal blur" style="max-height: 100vh; overflow: hidden">
      <div
        id="modals"
        ref="content"
        class="w3-modal-content w3-card-4 w3-theme w3-round-large w3-padding-small w3-border-theme"
        style="max-height: 85vh; overflow: auto"
      >
        <slot name="content" style="overflow: auto"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Notifications } from '@/components/UICommon/Notifications/NotificationsClass'
import { GlobStateInst } from '@/GlobStateClass'
import { onClickOutside } from '@vueuse/core'
import { PropType, ref } from 'vue'

const props = defineProps({
  animateDirection: {
    type: String as PropType<'top' | 'bottom' | 'left' | 'right' | 'opacity' | 'zoom' | 'fading'>,
    default: () => 'top'
  },
  disabled: {
    type: Boolean,
    default: () => false
  }
})

const dialogVisible = ref(false)
const modal = ref()
const content = ref()
const contentVis = ref(false)

onClickOutside(content, (event) => {
  if (Notifications.isShowing()) return
  closeModal()
})

async function openModal() {
  if (props.disabled) return
  dialogVisible.value = true
  await nextTick()
  contentVis.value = true
  if (!content.value) return
  content.value.classList.add(`w3-animate-${props.animateDirection}`)
  modal.value.style.display = 'block'
  GlobStateInst.dialogGlobOpen.value = true
  console.log('modal open')
}

watch(
  () => GlobStateInst.dialogGlobOpen.value,
  () => {
    if (!GlobStateInst.dialogGlobOpen.value) {
      closeModal()
    }
  }
)

function closeModal() {
  if (modal.value) modal.value.style.display = 'none'

  dialogVisible.value = false
}
defineExpose({ closeModal })
</script>

<style lang="scss" scoped>
.blur {
  backdrop-filter: blur(10px) brightness(60%);
}
</style>
