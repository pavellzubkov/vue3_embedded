<template>
  <div v-if="visible">
    <div class="w3-bar">
      <FilterSpnsButC v-if="!isSelect" class="w3-bar-item padding-2"></FilterSpnsButC>
      <input
        class="w3-bar-item w3-input w3-border w3-round padding-2"
        style="margin-left: 6px"
        type="search"
        placeholder="Поиск..."
        v-model="search"
      />
    </div>
    <div ref="scrolEl" v-bind="containerProps" class="w3-card-2 w3-border w3-border-theme w3-round params-list" :style="`height:${props.listHeiht}`">
      <div v-bind="wrapperProps">
        <div v-for="res in list" :key="res.data.item._id">
          <SpnOneC :spn="res.data.item" :with-pgn-link="!isSelect" :is-select="isSelect"></SpnOneC>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IJ1939SpnPrint, J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { refThrottled, useVirtualList } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'

console.debug('TabDataAllC created')
const props = defineProps({
  isSelect: {
    type: Boolean,
    default: () => false
  },
  listHeiht: {
    type: String
  }
})

const visible = ref(false)
const search = ref('')
const throtledSearch = refThrottled(search, 700)

const options = computed<UseFuseOptions<IJ1939SpnPrint>>(() => ({
  fuseOptions: {
    keys: ['name_ru', 'name'],
    isCaseSensitive: false,
    threshold: undefined //exactMatch.value ? 0 : undefined
  },
  resultLimit: undefined,
  matchAllWhenSearchEmpty: true
}))
const { results } = useFuse(throtledSearch, props.isSelect ? J1939decoder.allSpns : J1939decoder.filteredSpns, options)

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(results, {
  itemHeight: 80,
  overscan: 2
})

// const listStyle = ref('')
// if (props.listHeiht) {
//   listStyle.value = `height:${props.listHeiht}`
// }

watch(
  () => throtledSearch.value,
  () => {
    scrollTo(0)
  }
)

visible.value = true
</script>

<style scoped lang="scss">
.params-list {
  height: calc(var(--app-main-window-height) - var(--app-main-list-header) - var(--app-contaiter-margin) * 2);
  overflow-x: clip;
}
</style>
