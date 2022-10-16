import type { ChartClass } from '@/components/j1939/components/Graph/Chart/ChartClass'
import { IJ1939SpnPrint, J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { useLocalStorage } from '@vueuse/core'
import type { LineSeriesOption } from 'echarts'
import { Ref, ref } from 'vue'

export type IGraphValueItem = [number, number]

export interface IGraphSerieData {
  value: IGraphValueItem
}
export interface IGraphSpnsData extends LineSeriesOption {
  spnId: string
  name: string
  type: 'line'
  showSymbol: boolean
  connectNulls: boolean
  data: IGraphSerieData[]
}

export interface IGraphTooltipSpnInfo {
  name: string
  unit: string
  value: string | number
  bitToltip?: string
}

class GraphDataClass {
  public windowIntervalSec: Ref<number> = useLocalStorage('graphWinInterval', 30)
  private grInst: ChartClass | undefined
  private recTimer
  private recIntervalMs = ref(200)

  public spnsInGraph: IGraphSpnsData[] = []
  public spnsInGraphIds: Ref<string[]> = ref([])
  public graphIsWindow: Ref<boolean> = useLocalStorage('graphIsWindow', true)
  public isListNotEmpty = computed(() => this.spnsInGraphIds.value.length > 0)
  public graphListLength = computed(() => this.spnsInGraphIds.value.length)
  public isDatastart = ref(false)

  // private isRecActive: Ref<boolean>

  static instance: GraphDataClass

  public static getInstance = (): GraphDataClass => {
    if (!GraphDataClass.instance) {
      GraphDataClass.instance = new GraphDataClass()
    }
    return GraphDataClass.instance
  }

  public spnIdExistInList = (spnId: string): boolean => {
    const ind = this.spnsInGraph.findIndex((el) => el.spnId == spnId)
    return ind > -1
  }

  public setGraphInst = (grInst: ChartClass) => {
    this.grInst = grInst
  }

  public resetAllData = () => {
    this.stop()
    this.spnsInGraph = []
    this.spnsInGraphIds.value = []
    this.grInst?.setData([])
  }

  public addDeleteSpnId = (spnId: string, add: boolean) => {
    console.log('addDeleteSpnId', spnId, add)
    if (add && this.spnIdExistInList(spnId)) return
    if (add) {
      if (this.spnsInGraph.length === 0) this.start()
      this.spnsInGraph.push({
        spnId: spnId,
        data: [],
        type: 'line',
        animation: false,
        connectNulls: false,
        showSymbol: false,
        name: spnId,
        sampling: 'lttb',
        emphasis: { disabled: true },
        select: { disabled: true }
      })
      this.spnsInGraphIds.value.push(spnId)
    } else {
      const ind = this.spnsInGraph.findIndex((el) => el.spnId === spnId)
      console.log('splice ind', ind)
      this.spnsInGraph.splice(ind, 1)
      this.spnsInGraphIds.value.splice(ind, 1)
    }

    if (this.spnsInGraph.length === 0) {
      clearInterval(this.recTimer)
    }
  }

  private getSpnIdData = (spnId: string): number | null => {
    const curSpn: IJ1939SpnPrint | undefined = J1939decoder.allSpns.value.find((spn) => spn._id == spnId)
    if (!curSpn) return null
    if (J1939decoder.ErrorsDecoder.isSpnIdInActiveCodes(curSpn._id)) return null
    if (typeof curSpn.value.value === 'number') return curSpn.value.value
    console.log('getSpnIdData not num ', Number.parseInt(curSpn.value_bin?.value || '', 2))
    return Number.parseInt(curSpn.value_bin?.value || '', 2)
  }

  public setData = (first = false) => {
    if (this.grInst && this.grInst.isChartExist()) {
      this.grInst.setData(this.spnsInGraph)
    }
    if (first && !this.recTimer) {
      this.grInst?.showDataZoom(true)
    }
  }

  private recData = () => {
    this.spnsInGraph.forEach((spnData) => {
      const val = this.getSpnIdData(spnData.spnId)
      const ts = Math.round(Date.now() / 100) * 100
      spnData.data.push({ value: [ts, val as number] })
      if (this.graphIsWindow.value && this.windowIntervalSec.value > 0) {
        let secsInArr = (ts - spnData.data[0].value[0]) / 1000
        while (secsInArr > this.windowIntervalSec.value) {
          spnData.data.shift()
          secsInArr = (ts - spnData.data[0].value[0]) / 1000
        }
      }
    })
    this.setData()
    console.log('graph set data')
  }

  clearGraphData = () => {
    this.spnsInGraph.forEach((spnData) => {
      spnData.data = []
    })
    this.setData()
  }

  start = () => {
    console.log('graph rec data start')
    this.isDatastart.value = true
    this.grInst?.showDataZoom(false)
    this.recTimer = setInterval(this.recData, 200)
  }
  stop = () => {
    console.log('graph rec data stop')
    this.isDatastart.value = false
    if (this.grInst) {
      this.grInst.showDataZoom(true)
    }
    clearInterval(this.recTimer)
  }
}

export const GraphData = GraphDataClass.getInstance()
