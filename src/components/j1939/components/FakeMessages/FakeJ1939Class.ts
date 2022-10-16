import type { IJ1939TemplateSpn } from '@/components/j1939/components/Files/Shemas/decoderData'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { GlobStateInst } from '@/GlobStateClass'
import { setBitsValue } from '@/utils/transformArray'

interface ISpnGenerateData {
  prevVal?: number
  direction?: boolean
  min?: number
  max?: number
  changeStep: number
}

interface ISpnGenOptions {
  [spnN: string]: ISpnGenerateData
}

type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (...a: infer X) => void ? X : never
type GrowToSize<T, A extends Array<T>, N extends number> = { 0: A; 1: GrowToSize<T, Grow<T, A>, N> }[A['length'] extends N ? 0 : 1]

type FixedArray<T, N extends number> = GrowToSize<T, [], N>

type IJErrorArr = FixedArray<number, 3>[]

interface IBitsSpnCounters {
  [spnId: string]: {
    counter: number
    prevval: number
  }
}

interface IFakeEcus {
  ecuAdr: number
  pgns: number[]
}

class FakeJ1939Class {
  private paramsIntervalId
  private errsIntervalId
  private ecus: IFakeEcus[] = [
    { ecuAdr: 0, pgns: [61444, 65262] },
    { ecuAdr: 3, pgns: [61452] }
  ]
  private generateSpnsInterval = 50
  private generateCodesInterval = 1000
  private defaultPriority = 2
  private errMessCounter = 0
  private errAmount = 5
  private bitsValsDropCounter = 50
  private bitsSpnCountef: IBitsSpnCounters = {}
  private spnGetObj: ISpnGenOptions = {
    '190': {
      changeStep: 100
    },
    '513': {
      changeStep: 5
    },
    '110': {
      changeStep: 3
    }
  }
  private ActiveCodesArr: IJErrorArr = [
    [108, 3, 15],
    [91, 8, 41],
    [105, 4, 50],
    [102, 3, 5],
    [110, 3, 20]
  ]

  constructor() {
    console.log('faker created')
  }

  private getBoundRand = (min: number, max: number, offset = 0): number => {
    return Math.random() * (max - min) + min // + offset
  }

  private getSpnGeneratedData = (template: IJ1939TemplateSpn): number => {
    const offset = template.offset || 0
    const min = template.data_range[0]
    const max = template.data_range[1]
    const center = (max - min) / 2
    const locSpnGen = this.spnGetObj[template.SPNd]
    let rand = this.getBoundRand(min, max, offset)
    if (locSpnGen) {
      if (locSpnGen.prevVal === undefined) {
        locSpnGen.prevVal = rand
        locSpnGen.direction = Math.random() < 0.5

        locSpnGen.max = this.getBoundRand(center, max, offset)
        locSpnGen.min = this.getBoundRand(min, center, offset)
      } else {
        const step = Math.random() * locSpnGen.changeStep
        const nval = locSpnGen.direction ? (locSpnGen.prevVal += step) : (locSpnGen.prevVal -= step)
        if (locSpnGen.max === undefined) {
          locSpnGen.max = this.getBoundRand(center, max, offset)
        }
        if (nval >= locSpnGen.max) {
          rand = locSpnGen.prevVal = locSpnGen.max
          locSpnGen.direction = !locSpnGen.direction
          locSpnGen.min = this.getBoundRand(min, center, offset)
          return rand
        }
        if (locSpnGen.min === undefined) {
          locSpnGen.min = this.getBoundRand(min, center, offset)
        }
        if (nval <= locSpnGen.min) {
          rand = locSpnGen.prevVal = locSpnGen.min
          locSpnGen.direction = !locSpnGen.direction
          locSpnGen.max = this.getBoundRand(center, max, offset)
          return rand
        }
        rand = locSpnGen.prevVal = nval
        return rand
      }
    }
    return rand
  }

  private setSpnData = (ab: ArrayBuffer, template: IJ1939TemplateSpn, startByte: number, startBit: number) => {
    const dv = new DataView(ab)
    const resolution = template.resolution || 1
    // if (!template.data_range || template.data_range.length == 0) return
    if (template.lengthIn === 'bits') {
      if (this.bitsSpnCountef[template.SPNd] === undefined) {
        this.bitsSpnCountef[template.SPNd] = {
          counter: 0,
          prevval: 0
        }
      }
      const byteOffset = J1939decoder.offset_nData + startByte - 1
      this.bitsSpnCountef[template.SPNd].counter++

      if (this.bitsSpnCountef[template.SPNd].counter >= this.bitsValsDropCounter) {
        this.bitsSpnCountef[template.SPNd].counter = 0
        if (template.switchVals === undefined) template.switchVals = []
        const randIndex = Math.round(Math.random() * template.switchVals.length - 1)
        if (template.switchVals[randIndex] === undefined) return
        const valStr = template.switchVals[randIndex].key_bit
        const valNum = Number.parseInt(valStr, 2)
        if (!template.length || template.length === 0) return
        const valDest = dv.getUint8(byteOffset)
        const out = setBitsValue(valDest, startBit - 1, template.length, valNum)
        dv.setUint8(byteOffset, out)
        this.bitsSpnCountef[template.SPNd].prevval = valNum
      } else {
        const valDest = dv.getUint8(byteOffset)
        if (!template.length || template.length === 0) return
        const out = setBitsValue(valDest, startBit - 1, template.length, this.bitsSpnCountef[template.SPNd].prevval || 0)
        dv.setUint8(byteOffset, out)
      }
      return
    }

    const randVal = this.getSpnGeneratedData(template)
    const dVal = Math.round(randVal / resolution)
    const byteOffset = J1939decoder.offset_nData + startByte - 1
    switch (template.length) {
      case 1:
        dv.setUint8(byteOffset, dVal)
        break
      case 2:
        dv.setUint16(byteOffset, dVal, true)
        break
      case 4:
        dv.setUint32(byteOffset, dVal, true)
        break
    }
  }

  private getFakePgnDataView = async (pgnD: number, srcAdr: number, buffer: ArrayBuffer): Promise<DataView | undefined> => {
    const Decoder = J1939decoder
    const pgnTemplate = await Decoder.getPgnTemplate(pgnD)
    if (!pgnTemplate) return

    const dv = new DataView(buffer)

    dv.setUint32(Decoder.offset_pgn, pgnD, true)
    dv.setUint16(Decoder.offset_datalen, 8, true)
    dv.setUint8(Decoder.offset_nPriority, this.defaultPriority)
    dv.setUint8(Decoder.offset_nSrcAddr, srcAdr)
    dv.setUint8(Decoder.offset_nDestAddr, 255)
    for (const spnTempl of pgnTemplate.spns) {
      const spnTemplate = await Decoder.getSpnTemplate(spnTempl.SPNd)
      if (!spnTemplate) return
      this.setSpnData(buffer, spnTemplate, spnTempl.startByte, spnTempl.startBit)
    }

    return dv
  }

  private setErrorsArray = (dv: DataView, dataOffset: number, errorsAmount: number) => {
    dv.setUint8(dataOffset, 250)
    dv.setUint8(dataOffset + 1, 245)
    const lampBytesOffset = 2
    for (let i = 0; i < errorsAmount; i++) {
      const startOffset = i * 4 + dataOffset + lampBytesOffset
      dv.setUint16(startOffset, this.ActiveCodesArr[i][0], true)
      dv.setUint8(startOffset + 2, this.ActiveCodesArr[i][1])
      dv.setUint8(startOffset + 3, this.ActiveCodesArr[i][2])
    }
  }

  private calcErrAmount = () => {
    this.errMessCounter++
    if (this.errMessCounter % 10 == 0) {
      this.errAmount = (this.errMessCounter / 10) % 2 == 0 ? this.ActiveCodesArr.length - 1 : this.ActiveCodesArr.length
    }
  }

  private getFakeActiveCodes = (ecuAdr: number): DataView => {
    this.calcErrAmount()
    const errorsAmount = this.errAmount
    const errorsBytes = errorsAmount * 4 + 2
    const buffer = new ArrayBuffer(errorsBytes + J1939decoder.offset_nData)
    const dv = new DataView(buffer)
    dv.setUint32(J1939decoder.offset_pgn, 65226, true)
    dv.setUint16(J1939decoder.offset_datalen, errorsBytes, true)
    dv.setUint8(J1939decoder.offset_nPriority, 3)
    dv.setUint8(J1939decoder.offset_nSrcAddr, ecuAdr)
    dv.setUint8(J1939decoder.offset_nDestAddr, 255)
    this.setErrorsArray(dv, J1939decoder.offset_nData, errorsAmount)
    return dv
  }

  private generateFParams = async () => {
    for (const ecu of this.ecus) {
      for (const pgnD of ecu.pgns) {
        try {
          const payloadDataLength = 8
          let buffer: ArrayBuffer | null = new ArrayBuffer(J1939decoder.offset_nData + payloadDataLength)

          const ab = await this.getFakePgnDataView(pgnD, ecu.ecuAdr, buffer)
          if (!ab) {
            buffer = null
            return
          }
          await J1939decoder.decodeInpArray(ab, true)
          buffer = null
        } catch (e) {
          console.error('generateFParams error')
        }
      }
    }
  }

  private startGenerateFakeParams = (timeIntervalMs: number) => {
    this.paramsIntervalId = setInterval(this.generateFParams, timeIntervalMs)
  }

  private generateFCodes = () => {
    const dv = this.getFakeActiveCodes(0)
    J1939decoder.decodeInpArray(dv, true).then().catch()
  }

  private startGenerateFakeActiveCodes = (timeIntervalMs: number) => {
    this.errsIntervalId = setInterval(this.generateFCodes, timeIntervalMs)
  }

  start = () => {
    this.startGenerateFakeParams(this.generateSpnsInterval)
    this.startGenerateFakeActiveCodes(this.generateCodesInterval)
  }

  stop = () => {
    if (this.paramsIntervalId) clearInterval(this.paramsIntervalId)
    if (this.errsIntervalId) clearInterval(this.errsIntervalId)
    GlobStateInst.fakeGenIsEnabled.value = false
  }
}

export const FakeJ1939 = new FakeJ1939Class()
