<template>
  <div ref="graphFull" style="width: 100%; height: 100%; background-color: var(--color-bg)">
    <GraphMenuButtonsC
      v-if="grFullButVis"
      :el="graphFull"
      :gr-inst="grInst"
      style="position: absolute; background-color: transparent"
    ></GraphMenuButtonsC>
    <div :id="elemid" style="height: 100%; width: 100%; position: absolute; z-index: -1" />
  </div>
</template>

<script lang="ts" setup>
import { ChartClass } from '@/components/j1939/components/Graph/Chart/ChartClass'
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
import { Layout } from '@/layouts/LayoutClass'
import type { ResizeOpts } from 'echarts'

const elemid = 'asdgKJhsj3235'
const graphFull = ref<HTMLElement>()
const grFullButVis = ref(false)
const grInst = new ChartClass()

watch(
  () => Layout.isDark.value,
  async () => {
    await initChart(Layout.isDark.value)
    GraphData.setGraphInst(grInst)
    GraphData.setData(false)
  }
)

const resizeGraph = () => {
  console.log('graph sidebarclosed ', Layout.viewRect.value)
  const wdt = grInst.isFullScreen.value ? Layout.scrW.value : Layout.viewRect.value.width
  const hgt = grInst.isFullScreen.value ? Layout.scrH.value : Layout.viewRect.value.height
  const opts: ResizeOpts = { width: wdt, height: hgt }
  console.log('graph sidebarclosed ', opts)
  grInst.resize(opts)
}

watch(
  () => Layout.viewRect.value,
  () => {
    resizeGraph()
  }
)

const initChart = async (isDark: boolean) => {
  grInst.init(document.getElementById(elemid), isDark)
  await nextTick()
  resizeGraph()
}
onMounted(async () => {
  await initChart(Layout.isDark.value)
  GraphData.setGraphInst(grInst)
  GraphData.setData(true)
  grFullButVis.value = true
})
onBeforeUnmount(() => {
  console.log('GraphModuleC unmounted')

  grInst.dispose(document.getElementById(elemid))
})
</script>
