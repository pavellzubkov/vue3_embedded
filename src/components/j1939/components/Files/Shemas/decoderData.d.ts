export interface IJ1939decoderSpnMapItem {
  SPNd: number
  descr_en: string
  startByte: number
  startBit: number
  length: number
  lengthIn: 'bits' | 'bytes'
}

export interface IJ1939TemplatePgn {
  PGNd: number
  name_en: string
  name_ru: string
  short: string
  descr_en: string
  descr_ru: string
  dataLength: string
  trans_rate: string
  spns: IJ1939decoderSpnMapItem[]
}

export interface IJ1939decoderSpnSwitchVals {
  key_bit: string
  val_en: string
  val_ru: string
}

export interface IJ1939TemplateSpn {
  SPNd: number
  name_en: string
  name_ru: string
  description_en: string
  description_ru: string
  data_range: number[]
  resolution?: number
  unit?: string
  offset?: number
  length?: number
  lengthIn?: 'bits' | 'bytes'
  PGNref: number
  switchVals?: IJ1939decoderSpnSwitchVals[]
}

export interface IFileData {
  version: number
  description: string
}

export interface IJ1939DecoderFile extends IFileData {
  pgns: IJ1939TemplatePgn[]
  spns: IJ1939TemplateSpn[]
}

export interface IJ1939SourcesItem {
  srcAdr: number
  alias: string
  selected?: boolean
}

export interface IJ1939SourcesAliasFile extends IFileData {
  aliaces: IJ1939SourcesItem[]
}

export interface IJ1939DecoderObject {
  pgns: {
    [k as string]: IJ1939TemplatePgn
  }
  spns: {
    [k as string]: IJ1939TemplateSpn
  }
}
