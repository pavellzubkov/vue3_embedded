<template>
  <div>
    <transition appear enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut" mode="out-in">
      <slot></slot>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ZoomTransC'
}
</script>

<style scoped></style>
