import { WsJ1939ReqEcuOffset, WsJ1939ReqOffset, WsMessageTypeOut, WsMessJ1939Req, WsMessTypeOffset } from '@/AAAConfig/GlobConf'
import { StoreFilesClass } from '@/AAConnections/IDBStore/StoreFilesClass'
import { WebSocketInst } from '@/AAConnections/WebsClass'
import { ErrStoreClass } from '@/components/j1939/components/ErrCodes/ErrStoreClass'
import type { IJ1939errorFmi, IJ1939errorsFile, IJ1939errorSpn } from '@/components/j1939/components/Files/Shemas/j1939errorsDefault'
import type { IJ1939PgnPrint } from '@/components/j1939/DecodeJ1939MessClass'
import { Layout } from '@/layouts/LayoutClass'
import { getBitsValue, getIntFromArray, splitArraytoSubarray } from '@/utils/transformArray'
import type { Ref } from 'vue'
import { ref } from 'vue'

export interface IJ1939ErrorPrint {
  _id: string
  SRC: number
  SPN: number
  FMI: number
  OCC: number // occurense count
  lastTs: number
  active: Ref<boolean>
  isFake?: boolean
  description: {
    spn: IJ1939errorSpn
    fmi: IJ1939errorFmi
  }
}

export interface IJ1939ErrorLamp {
  mallfunction: number
  redstop: number
  amberwarning: number
  protect: number
}

export class DecodeJ1939Errors {
  activeErrorsArr: Ref<IJ1939ErrorPrint[]> = shallowRef([])
  storeErrorsArr: Ref<IJ1939ErrorPrint[]> = shallowRef([])
  errorLamps: Ref<IJ1939ErrorLamp> = ref({ mallfunction: 3, redstop: 3, amberwarning: 3, protect: 3 })
  langSelect: Ref<boolean> = ref(true)
  ecuSelected: Ref<number | string> = ref('')
  private actErrIntervalId

  private StoreErrs = new ErrStoreClass('errcodes')
  private ErrFile = new StoreFilesClass()

  constructor() {
    this.langSelect = Layout.langSelect
    this.actErrIntervalId = setInterval(this.clearActiveEr, 1000)
  }

  private clearActiveEr = () => {
    if (!this.activeErrorsArr || this.activeErrorsArr.value.length === 0) return
    const arr = unref(this.activeErrorsArr)
    this.activeErrorsArr.value = arr.filter((e) => Date.now() - e.lastTs < 2000)
    arr.length = 0
  }

  public getSpnIdFromErr = (errO: IJ1939ErrorPrint): string => {
    const erIdArr = errO._id.split('_')
    erIdArr.pop()
    return erIdArr.join('_')
  }

  public isSpnIdInActiveCodes = (spnId: string): boolean => {
    const activeSpnErrIds = this.activeErrorsArr.value.map((e) => this.getSpnIdFromErr(e))
    return activeSpnErrIds.findIndex((i) => i === spnId) > -1
  }

  private getErrorsObjfromArr = async (arrs: Uint8Array[], ecuAdr: number, errsArr: Ref<IJ1939ErrorPrint[]>, fake = false) => {
    for await (const arr of arrs) {
      let spn = getIntFromArray(arr, 0)
      let threemsb = arr[2] & 224 // 0b11100000
      threemsb = threemsb << 11
      spn = spn | threemsb
      let fmi = arr[2]
      fmi = fmi & 31 // 0b00011111
      if (spn !== 0 && spn !== 65535) {
        const errObj: IJ1939ErrorPrint = {
          _id: `${ecuAdr}_${spn}_${fmi}`,
          SRC: ecuAdr,
          SPN: spn,
          FMI: fmi,
          OCC: getBitsValue(arr[3], 0, 7), // occurense count
          lastTs: Date.now(),
          active: ref(true),
          isFake: fake,
          description: {
            spn: await this.StoreErrs.getSpnData(spn),
            fmi: await this.StoreErrs.getFmiData(fmi)
          }
        }
        errObj.active.value = this.activeErrorsArr.value.findIndex((er) => er._id === errObj._id) > -1
        this.addToOutArr(errsArr, errObj)
      }
    }
  }

  private addToOutArr(errsArr: Ref<IJ1939ErrorPrint[]>, errObj: IJ1939ErrorPrint) {
    const ind = errsArr.value.findIndex((er) => er._id === errObj._id)
    if (ind === -1) {
      errsArr.value.unshift(errObj)
    } else {
      errsArr.value[ind] = errObj
    }
    triggerRef(errsArr)
  }

  private setErrorLamp(lampByte: number): void {
    this.errorLamps.value.mallfunction = getBitsValue(lampByte, 6, 2)
    this.errorLamps.value.redstop = getBitsValue(lampByte, 4, 2)
    this.errorLamps.value.amberwarning = getBitsValue(lampByte, 2, 2)
    this.errorLamps.value.protect = getBitsValue(lampByte, 0, 2)
    // console.log('errLamp ', this.errorLamps.value, ' bits ', lampByte.toString(2))
  }

  private addToErrsArr = async (curPGN: IJ1939PgnPrint, errsArr: Ref<IJ1939ErrorPrint[]>) => {
    this.setErrorLamp(curPGN.d[0])
    const inpArr = unref(curPGN.d)
    const errsSubarr = inpArr.subarray(2, inpArr.length)
    const arrs: Uint8Array[] = splitArraytoSubarray(errsSubarr, 4)
    await this.getErrorsObjfromArr(arrs, curPGN.srsAdr, errsArr, curPGN.isFake)
  }

  isDiagnosticMessage = async (curPGN: IJ1939PgnPrint): Promise<boolean> => {
    // console.log('cur id -', curPGN.lid)

    if (curPGN.lid === 65226) {
      // console.log('aktive err mess ', curPGN.lid, ' length ', curPGN.length, ' src -', curPGN.srsAdr, ' dest -', curPGN.destAdr)
      await this.addToErrsArr(curPGN, this.activeErrorsArr)
      return true
    }
    if (curPGN.lid === 65227) {
      //console.log('stored err mess ', curPGN.lid, ' length ', curPGN.length, ' src -', curPGN.srsAdr, ' dest -', curPGN.destAdr)
      await this.addToErrsArr(curPGN, this.storeErrorsArr)
      return true
    }
    return false
  }

  reloadDecodeFile = async (): Promise<void> => {
    const f = (await this.ErrFile.initAndGetFile('j1939errors')) as IJ1939errorsFile
    if (!f) {
      console.error('cant load ErrsFile ')
      return
    }
    await this.StoreErrs.reInitStore(f)
  }

  sendRequestErrors(ecuAdr: number) {
    const as = new ArrayBuffer(3)
    const d = new DataView(as)
    d.setInt8(WsMessTypeOffset, WsMessageTypeOut.MESS_SEND_1939REQ)
    d.setInt8(WsJ1939ReqOffset, WsMessJ1939Req.GET_STORED_CODES)
    d.setInt8(WsJ1939ReqEcuOffset, ecuAdr)
    WebSocketInst.sendMess(d)
  }

  sendClearErrors(ecuAdr: number) {
    const as = new ArrayBuffer(3)
    const d = new DataView(as)
    d.setInt8(WsMessTypeOffset, WsMessageTypeOut.MESS_SEND_1939REQ)
    d.setInt8(WsJ1939ReqOffset, WsMessJ1939Req.CLEAR_STORED_CODES)
    d.setInt8(WsJ1939ReqEcuOffset, ecuAdr)
    WebSocketInst.sendMess(d)
    this.storeErrorsArr.value = []
  }
}
