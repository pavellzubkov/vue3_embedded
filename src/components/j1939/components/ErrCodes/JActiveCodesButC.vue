<template>
  <transition appear enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut" mode="out-in">
    <div v-if="errBadgeVal !== '0'">
      <MyIconC
        :class="shakeButClass"
        icon="CodesActive"
        tooltip="Активные ошибки.Подробнее..."
        :badge-text="errBadgeVal"
        @click="RouterService.goToName('JActiveCodes')"
      >
      </MyIconC>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { RouterService } from '@/router/RouterServiceClass'
import { promiseTimeout } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const errArr = J1939decoder.ErrorsDecoder.activeErrorsArr
const errArrLength = computed(() => errArr.value.length)
const shakeButClass = ref('icon-button')
const errBadgeVal = ref('0')

watch(
  () => errArrLength.value,
  async (value, oldValue) => {
    console.log('err arr but shake', value, oldValue)
    errBadgeVal.value = value.toString()
    if (!oldValue) return
    if (value < oldValue) return
    shakeButClass.value = 'icon-button animate__animated animate__shakeY animate__repeat-1 icon-button'
    await promiseTimeout(1200)
    shakeButClass.value = 'icon-button'
  },
  {
    immediate: true
  }
)
</script>
