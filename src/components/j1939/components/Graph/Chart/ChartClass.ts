import { macarons_theme } from '@/components/j1939/components/Graph/Chart/echartsthemes'
import type { IGraphSerieData, IGraphSpnsData, IGraphTooltipSpnInfo } from '@/components/j1939/components/Graph/GraphDataClass'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { TextTools } from '@/utils/TextToolsClass'
import type * as ECharts from 'echarts'
import type { GridComponentOption, ResizeOpts, YAXisComponentOption } from 'echarts'
import * as Echarts from 'echarts'
import type { DataZoomComponentOption } from 'echarts/types/dist/echarts'
import type { CallbackDataParams, TopLevelFormatterParams } from 'echarts/types/dist/shared'
import type { Ref } from 'vue'
import { ref } from 'vue'

export interface IGraphZoomedRegion {
  startVal: number
  endVal: number
}

export class ChartClass {
  private chart: ECharts.EChartsType | undefined
  public isFullScreen: Ref<boolean> = ref(false)
  public isChartExist = (): boolean => {
    return !this.chart?.isDisposed()
  }
  private yAxisDefault: YAXisComponentOption = {
    type: 'value',
    show: false,
    max: function (value) {
      return value.max * 1.1
    },
    min: function (value) {
      return value.min * (value.min < 0 ? 1.1 : 0.9)
    }
  }

  private gridDefault: GridComponentOption = {
    left: 15,
    right: 15,
    top: 100,
    bottom: 25
  }

  private dataZoomDefault: DataZoomComponentOption[] = [
    {
      type: 'inside',
      show: false
    },
    {
      type: 'slider',
      show: false
    }
  ]

  private data: IGraphSerieData[] = []

  private getParamInfo = (seriesId: string | undefined, val: number | null): IGraphTooltipSpnInfo => {
    if (!seriesId) return { name: '', unit: '', value: '', bitToltip: '' }
    return J1939decoder.getSpnGraphTooltipData(seriesId.split('_')[1], val)
  }

  private formatterF = (params: TopLevelFormatterParams): string => {
    console.log('formatter params ', params)
    const arr = params as CallbackDataParams[]
    const ts = arr[0].value[0]
    let out = `<li><label>${TextTools.formatTimestamp(ts)}</label></li>`
    arr.forEach((param) => {
      const grInf = this.getParamInfo(param.seriesName, param.value[1])
      const btoll = grInf.bitToltip === '' ? '' : `<span style="font-size: 9px;padding: 0;margin: 0">(${grInf.bitToltip})</span>`
      out =
        out +
        `<li style="margin: 2px;display: block"><div style="margin: 0">${param.marker} ${grInf.name} : ${grInf.value} ${grInf.unit}</div> ${btoll}</li>`
    })
    return out
  }

  private _graphOpts: ECharts.EChartsOption = {
    darkMode: 'auto',
    tooltip: {
      trigger: 'axis',
      formatter: this.formatterF,
      showDelay: 200,
      axisPointer: {
        animation: false
      }
    },
    grid: this.gridDefault,
    dataZoom: this.dataZoomDefault,
    xAxis: {
      type: 'time',
      offset: 0,
      boundaryGap: ['2%', '2%'],
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        show: true,
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        show: true,
        offset: 10,
        position: 'right',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        showSymbol: false,
        data: this.data
      }
    ]
  }

  constructor() {
    console.debug('Chart Class created')
  }

  public init = (domEl: HTMLElement | null, isDark: boolean) => {
    console.log('chart init')
    Echarts.registerTheme('macarons', macarons_theme)
    if (domEl) {
      if (this.chart) this.chart.dispose()

      this.chart = Echarts.init(domEl, isDark ? 'dark' : 'macarons', {
        renderer: 'canvas'
      })
    }
    this.chart?.setOption(this._graphOpts, false, false)
  }

  public showDataZoom = (show: boolean) => {
    if (this.chart?.isDisposed()) return
    this.dataZoomDefault[0] = {
      show: show,
      type: 'inside',
      disabled: !show,
      start: 0,
      end: 100
    }
    this.dataZoomDefault[1] = {
      show: show,
      type: 'slider',
      start: 0,
      end: 100
    }
    this.gridDefault.bottom = show ? 70 : 25
    this.chart?.setOption({
      grid: this.gridDefault,
      dataZoom: this.dataZoomDefault
    })
  }

  public setData = (data: IGraphSpnsData[]) => {
    const yaxises = data.length > 0 ? data.map(() => this.yAxisDefault) : []
    const ndata =
      data.length > 0
        ? data.map((d, index) => {
            d.yAxisIndex = index
            return d
          })
        : []
    const notMerge = data.length <= 0
    this.chart?.setOption(
      {
        yAxis: yaxises,
        series: ndata
      },
      notMerge,
      true
    )
  }

  public dispose = (domEl: HTMLElement | null) => {
    this.chart?.clear()
    this.chart?.dispose()
    Echarts.dispose(domEl as HTMLElement)
    this.chart = undefined
    console.debug('Echarts disposed')
  }

  public resize = (opts?: ResizeOpts) => {
    this.chart?.resize(opts)
  }
}
