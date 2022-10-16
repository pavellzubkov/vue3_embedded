import { StoreFilesClass } from '@/AAConnections/IDBStore/StoreFilesClass'
import { DecodeJ1939Errors } from '@/components/j1939/components/ErrCodes/DecodeJ1939Errors'
import { aliasesDefault } from '@/components/j1939/components/Files/Shemas/aliacesDefault'
import type {
  IJ1939DecoderFile,
  IJ1939SourcesAliasFile,
  IJ1939SourcesItem,
  IJ1939TemplatePgn,
  IJ1939TemplateSpn
} from '@/components/j1939/components/Files/Shemas/decoderData'
import type { IGraphTooltipSpnInfo } from '@/components/j1939/components/Graph/GraphDataClass'
import { FilterSpns } from '@/components/j1939/components/JParams/Filter/FilterSpnsClass'
import { DecodeStoreClass } from '@/components/j1939/DecodeStoreClass'
import { Layout } from '@/layouts/LayoutClass'
import { generateColor } from '@/utils/colorsArray'
import { TextTools } from '@/utils/TextToolsClass'
import { getBitsValue } from '@/utils/transformArray'
import { useArrayFilter } from '@vueuse/core'
import type { Ref, ShallowRef } from 'vue'

export interface IJ1939PgnPrint {
  _id: string
  lid: number
  length: number
  srsAdr: number
  destAdr: number
  priority: number
  isFake?: boolean
  d: Ref<Uint8Array>
}

export interface IJ1939SpnPrint {
  _id: string
  id: number
  srsAdr: number
  destAdr: number
  lengthIh: 'bytes' | 'bits' | undefined
  name: string
  name_ru: string
  discr_en: string
  discr_ru: string
  parentPgn: number
  isBitsVal: boolean
  passFilter: boolean
  isOutOfBound: Ref<boolean>
  isFake?: boolean
  value: Ref<number | string>
  value_bin?: Ref<string>
  unit: string | undefined
}

export class DecodeJ1939MessClass {
  public readonly offset_pgn = 1
  public readonly offset_datalen = 5
  public readonly offset_nPriority = 7
  public readonly offset_nSrcAddr = 8
  public readonly offset_nDestAddr = 9
  public readonly offset_nData = 10

  public messageCounter = ref(0)
  public isFakedStream = ref(true)
  private isConnectedTimer
  public isConnected: Ref<boolean> = ref(false)
  private lastMessTs: number = Date.now() - 2000000

  private aliacesFile: IJ1939SourcesAliasFile = aliasesDefault

  allPgns: Ref<IJ1939PgnPrint[]> = shallowRef([])
  allSpns: Ref<IJ1939SpnPrint[]> = shallowRef([])
  filteredSpns: Ref<IJ1939SpnPrint[]> = useArrayFilter(this.allSpns, (spn) => FilterSpns.spnPassFilter(spn))
  availableEcus: Ref<IJ1939SourcesItem[]> = ref([])
  langIsRu: Ref<boolean> = ref(true)
  public unitsColorsObj = computed(() => {
    const allUnitsArr = this.allSpns.value.map((spn) => spn.unit || 'str')
    const uniqUnits = [...new Set(allUnitsArr)]
    const colors = generateColor('#c02248', '#45a7ed', uniqUnits.length)
    const out = {}
    uniqUnits.forEach((spnName, index) => {
      out[spnName] = colors[index]
    })

    return out
  })

  private StoreDecoder: DecodeStoreClass = new DecodeStoreClass('decoder')
  ErrorsDecoder: DecodeJ1939Errors = new DecodeJ1939Errors()

  static instance: DecodeJ1939MessClass

  private constructor() {
    this.langIsRu = Layout.langSelect
    this.isConnectedTimer = setInterval(() => {
      if (Date.now() - this.lastMessTs > 2000) {
        this.isConnected.value = false
      }
    }, 2000)
  }

  public static getInstance(): DecodeJ1939MessClass {
    if (!DecodeJ1939MessClass.instance) {
      DecodeJ1939MessClass.instance = new DecodeJ1939MessClass()
    }
    return DecodeJ1939MessClass.instance
  }

  public getEcuAlias = (secAdr: number): string => {
    return this.availableEcus.value.find((item) => item.srcAdr === secAdr)?.alias || ''
  }

  private updateSrcAliaces = (curPGN: IJ1939PgnPrint): void => {
    const filterAliasItem = this.aliacesFile.aliaces.find((el) => el.srcAdr === curPGN.srsAdr)
    if (this.availableEcus.value.find((ec) => ec.srcAdr === curPGN.srsAdr)) return
    if (!filterAliasItem) {
      this.availableEcus.value.push({ srcAdr: curPGN.srsAdr, alias: 'Неизвестно' })
    } else {
      this.availableEcus.value.push(filterAliasItem)
    }
  }

  private addToAllPgns(curPGN: IJ1939PgnPrint) {
    const ind = this.allPgns.value.findIndex((x) => x._id == curPGN._id)
    if (ind > -1) {
      this.allPgns.value[ind] = curPGN
    } else {
      this.allPgns.value.push(curPGN)
    }
    triggerRef(this.allPgns)
  }

  private getInputPgn = (inpArr: DataView, fake = false): IJ1939PgnPrint => {
    const dat = inpArr // new DataView(inpArr.buffer)
    const pgnN = dat.getUint32(this.offset_pgn, true)
    const length = dat.getInt16(this.offset_datalen, true)
    const priority = dat.getUint8(this.offset_nPriority)
    const srsAdr = dat.getUint8(this.offset_nSrcAddr)
    const destAdr = dat.getUint8(this.offset_nDestAddr)
    const datArr = ref(new Uint8Array(dat.buffer, this.offset_nData, length))

    return {
      _id: `${srsAdr}_${pgnN}`,
      lid: pgnN,
      length,
      priority,
      destAdr,
      srsAdr,
      isFake: fake,
      d: datArr
    }
  }

  private addToSpnList = (spn: IJ1939SpnPrint, list: ShallowRef<IJ1939SpnPrint[]>) => {
    const ind = list.value.findIndex((spnExist) => spnExist._id == spn._id)
    if (ind > -1) {
      list.value[ind].value.value = spn.value.value
      list.value[ind].isOutOfBound.value = spn.isOutOfBound.value
      if (list.value[ind].value_bin) {
        // @ts-ignore
        list.value[ind].value_bin.value = spn.value_bin?.value || '00000000'
      }
    } else {
      list.value.push(spn)
      triggerRef(list)
    }
  }

  private addSpn = (spnData: number, spnN: number, srcAdr: number, destAdr: number, template: IJ1939TemplateSpn, fake = false) => {
    const spn: IJ1939SpnPrint = {
      _id: `${srcAdr}_${spnN}`,
      id: spnN,
      srsAdr: srcAdr,
      destAdr: destAdr,
      name_ru: template.name_ru,
      name: template.name_en,
      parentPgn: template.PGNref,
      passFilter: false,
      isOutOfBound: ref(false),
      isBitsVal: template.lengthIn === 'bits',
      lengthIh: template.lengthIn,
      discr_en: template.description_en,
      discr_ru: template.description_ru,
      isFake: fake,
      unit: template.unit,
      value: ref(Infinity)
    }
    if (template.switchVals && template.switchVals.length > 0) {
      const length = template.length || 0
      const bVal = spnData.toString(2).padStart(length, '0')

      const val = template.switchVals.find((v) => v.key_bit == bVal)
      if (val) {
        if (val.val_en == 'Not Available') return
        if (val.val_en == 'Reserved') return
        spn.isBitsVal = true
        spn.value.value = this.langIsRu.value ? val.val_ru : val.val_en
        spn.value_bin = ref(bVal)
      }
    } else if (template.resolution) {
      spn.isBitsVal = false
      const offset = template.offset || 0
      const val = spnData * template.resolution + offset
      spn.value.value = Number.isInteger(val) ? val : Number.parseFloat(val.toFixed(1))
      if (!template.data_range) {
        // console.log('spn ', spn.id)
      } else {
        spn.isOutOfBound.value = !!template.data_range[1] && spn.value.value >= template.data_range[1]
      }
    }
    if (spn.value.value == Infinity) return

    this.addToSpnList(spn, this.allSpns)
  }

  private decodeSPNS = async (pgn: IJ1939PgnPrint) => {
    const pgnTemplate = await this.getPgnTemplate(pgn.lid)
    if (!pgnTemplate) return
    const inpArr = unref(pgn.d)

    pgnTemplate.spns.map(async (spn) => {
      const spnTemplate = await this.getSpnTemplate(spn.SPNd)
      if (!spnTemplate) return
      const datView = new DataView(inpArr.buffer, this.offset_nData, pgn.length)
      let spnVal = 0
      if (spn.lengthIn == 'bytes') {
        switch (spn.length) {
          case 1:
            spnVal = datView.getUint8(spn.startByte - 1)
            break
          case 2:
            spnVal = datView.getUint16(spn.startByte - 1, true)
            break
          case 4:
            spnVal = datView.getUint32(spn.startByte - 1, true)
            break
        }
      }
      if (spn.lengthIn == 'bits') {
        spnVal = getBitsValue(pgn.d[spn.startByte - 1], spn.startBit - 1, spn.length)
      }
      this.addSpn(spnVal, spn.SPNd, pgn.srsAdr, pgn.destAdr, spnTemplate, pgn.isFake)
    })
  }

  public getSpnPrint = (spn_id: string): IJ1939SpnPrint => {
    const empty: IJ1939SpnPrint = {
      _id: ``,
      id: 888888,
      srsAdr: -1,
      destAdr: 255,
      name_ru: 'Нет данных',
      name: 'Нет данных',
      parentPgn: -1,
      passFilter: false,
      isOutOfBound: ref(false),
      isBitsVal: false,
      lengthIh: 'bytes',
      discr_en: 'Нет данных',
      discr_ru: 'Нет данных',
      isFake: true,
      unit: 'Нет данных',
      value: ref(Infinity)
    }
    return this.allSpns.value.find((spn) => spn._id === spn_id) || empty
  }

  reloadDecodeFile = async (f: IJ1939DecoderFile): Promise<void> => {
    try {
      await this.StoreDecoder.reInitStore(f)
      console.log('decodeFile is Ok v ')
    } catch (e) {
      console.warn('decodeFile is missing set default ')
    }
  }

  getSpnTemplate = async (spnd: number | string): Promise<IJ1939TemplateSpn | undefined> => {
    const spnD = typeof spnd === 'string' ? Number.parseInt(spnd, 10) : spnd
    return await this.StoreDecoder.getSpnTemplate(spnD)
  }

  getSpnTemplateSync = (spnd: number | string): IJ1939TemplateSpn | undefined => {
    const spnD = typeof spnd === 'string' ? Number.parseInt(spnd, 10) : spnd
    return this.StoreDecoder.getSpnTemplateSync(spnD)
  }

  updateAllFiles = async () => {
    const filesStore = new StoreFilesClass()
    const f = await filesStore.initAndGetFile('j1939decoder')

    await this.reloadDecodeFile(f as IJ1939DecoderFile)
    this.aliacesFile = (await filesStore.initAndGetFile('j1939aliaces')) as IJ1939SourcesAliasFile

    await this.ErrorsDecoder.reloadDecodeFile()

    await filesStore.closeConnection()
  }

  getPgnTemplate(pgnd: number | string): Promise<IJ1939TemplatePgn | undefined> {
    const pgnD = typeof pgnd === 'string' ? Number.parseInt(pgnd.split('_')[1], 10) : pgnd
    return this.StoreDecoder.getPgnTemplate(pgnD)
  }

  getSpnGraphTooltipData = (spnd: string, val: number | null): IGraphTooltipSpnInfo => {
    const template = this.getSpnTemplateSync(spnd)

    const out: IGraphTooltipSpnInfo = {
      name: '',
      unit: '',
      value: '',
      bitToltip: ''
    }
    if (!template) return out

    out.name = this.langIsRu.value ? template.name_ru : template.name_en
    out.unit = template.unit || ''
    const nameWordsArr = out.name.split(' ')
    if (nameWordsArr.length > 4) {
      nameWordsArr.splice(3, nameWordsArr.length - 3)
      out.name = nameWordsArr.join(' ')
    }
    out.name = out.name = Layout.isDeviceMobile.value ? TextTools.compactWords(out.name, this.langIsRu.value) : out.name
    if (val === null) {
      out.value = this.langIsRu.value ? 'ошиб' : 'err'
      out.unit = ''
      return out
    }
    out.value = val
    if (template.switchVals && template.switchVals.length > 0) {
      const length = template.length || 0
      const bVal = out.value.toString(2).padStart(length, '0')

      const swval = template.switchVals.find((v) => v.key_bit == bVal)
      if (swval) {
        out.bitToltip = this.langIsRu.value ? swval.val_ru : swval.val_en
      }
    }
    console.log('getSpnGraphTooltipData ', out)
    return out
  }

  resetAllSpns = () => {
    this.allSpns.value = []
  }

  resetAllPgns = () => {
    this.allPgns.value = []
  }

  resetEcusList = () => {
    this.availableEcus.value = []
    FilterSpns.filterObj.value.infilterEcuAdrs = []
  }

  resetMessageCounter = () => {
    this.messageCounter.value = 0
  }

  resetAll = () => {
    this.allSpns.value = []
    this.allPgns.value = []
    this.availableEcus.value = []
    FilterSpns.filterObj.value.infilterEcuAdrs = []
    this.messageCounter.value = 0
  }

  decodeInpArray = async (data: DataView, fake = false): Promise<void> => {
    this.messageCounter.value++
    this.messageCounter.value = this.messageCounter.value >= 1000000 ? 0 : this.messageCounter.value
    this.isFakedStream.value = fake
    this.isConnected.value = true
    this.lastMessTs = Date.now()
    const curPGN = this.getInputPgn(data, fake)
    this.updateSrcAliaces(curPGN)
    this.addToAllPgns(curPGN)
    if (await this.ErrorsDecoder.isDiagnosticMessage(curPGN)) return
    await this.decodeSPNS(curPGN)
  }
}

export const J1939decoder = DecodeJ1939MessClass.getInstance()
