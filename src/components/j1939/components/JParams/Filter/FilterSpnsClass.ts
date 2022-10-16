import type { IJ1939SpnPrint } from '@/components/j1939/DecodeJ1939MessClass'
import { useStorage } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'

export interface IJFilter {
  infilterEcuAdrs: number[]
  showBitsVals: boolean
  showNumbVals: boolean
  showEdgeVals: boolean
  selectedSpnsGroup: string[]
}
export interface IJFilterSpnsGroup {
  name: string
  oldName?: string
  spns: number[]
  selected: boolean
}

class FilterSpnsClass {
  public readonly defaultFilter: IJFilter = {
    showBitsVals: true,
    showEdgeVals: true,
    showNumbVals: true,
    infilterEcuAdrs: [],
    selectedSpnsGroup: []
  }
  public readonly defaultSpnsGroups: IJFilterSpnsGroup[] = [{ name: 'Двс основное', spns: [190, 111, 92, 100, 94, 106], selected: false }]
  public filterObj: Ref<IJFilter> = useStorage('j-filter', this.defaultFilter, localStorage)
  public filterSpnsGroups: Ref<IJFilterSpnsGroup[]> = useStorage('j-filter-spnsGroups', this.defaultSpnsGroups)
  public selectedSpns: Ref<number[]> = ref([])
  private filterSpnsNumbs: ComputedRef<number[]> = computed(() => {
    const selected = this.filterSpnsGroups.value.filter((gr) => gr.selected)

    const spns = [...new Set(selected.map((gr) => gr.spns).flat())]
    // console.log('filter spns ', spns)
    this.filterObj.value.selectedSpnsGroup = selected.map((gr) => gr.name)
    return spns || []
  })

  public selectedSpnsAddDelete = (spnD: number) => {
    const ind = this.selectedSpns.value.findIndex((spn) => spn === spnD)
    if (ind === -1) {
      this.selectedSpns.value.push(spnD)
    } else {
      this.selectedSpns.value.splice(ind, 1)
    }
  }

  public spnPassFilter = (spn: IJ1939SpnPrint): boolean => {
    const passBitsFilter = this.filterObj.value.showBitsVals ? spn.isBitsVal === this.filterObj.value.showBitsVals : false
    const passBytesFilter = this.filterObj.value.showNumbVals ? !spn.isBitsVal === this.filterObj.value.showNumbVals : false
    const passEdgeFilter = this.filterObj.value.showEdgeVals ? true : spn.isOutOfBound.value === this.filterObj.value.showEdgeVals
    const passSrcAdrFilter = this.filterObj.value.infilterEcuAdrs.length === 0 || this.filterObj.value.infilterEcuAdrs.includes(spn.srsAdr)
    const passSpnsGroupFilter = this.filterSpnsNumbs.value.length === 0 || this.filterSpnsNumbs.value.includes(spn.id)
    return (passBitsFilter || passBytesFilter) && passEdgeFilter && passSrcAdrFilter && passSpnsGroupFilter
  }
}
export const FilterSpns = new FilterSpnsClass()
