import { IdbWrapperClass } from '@/AAConnections/IDBStore/IdbWrapperClass'
import type { IJ1939DecoderFile, IJ1939TemplatePgn, IJ1939TemplateSpn } from '@/components/j1939/components/Files/Shemas/decoderData'

interface ISpnCasheObj {
  [key: string]: IJ1939TemplateSpn | undefined
}

interface IPgnCacheObj {
  [k: string]: IJ1939TemplatePgn | undefined
}

export class DecodeStoreClass {
  private spnPref = 'spn_'
  private pgnPref = 'pgn_'
  private Store: IdbWrapperClass
  private baseName
  private storeName = 'templates'
  private spnCashe: ISpnCasheObj = {}
  private pgnCashe: IPgnCacheObj = {}

  constructor(baseName: string) {
    this.baseName = baseName
    this.Store = new IdbWrapperClass(baseName, this.storeName)
  }

  private setRecs = async (k: [IDBValidKey, any][]): Promise<void> => {
    return await this.Store.setMany(k)
  }

  reInitStore = async (fObj: IJ1939DecoderFile): Promise<void> => {
    //console.log('TASDFASDF', await this.Store.tryWebWorker.workerFn())
    await this.Store.clear()
    const spnsRecs: [IDBValidKey, IJ1939TemplateSpn][] = fObj.spns.map((spn) => [`${this.spnPref}${spn.SPNd}`, spn])
    const pgnsRecs: [IDBValidKey, IJ1939TemplatePgn][] = fObj.pgns.map((pgn) => [`${this.pgnPref}${pgn.PGNd}`, pgn])
    await this.setRecs(spnsRecs)
    await this.setRecs(pgnsRecs)
  }

  getSpnTemplate = async (spnN: number): Promise<IJ1939TemplateSpn | undefined> => {
    const key = `${this.spnPref}${spnN}`
    let spnTemplate = this.spnCashe[key]
    if (!spnTemplate) {
      this.spnCashe[key] = spnTemplate = await this.Store.get(key)
    }
    return spnTemplate
  }

  getSpnTemplateSync = (spnN: number): IJ1939TemplateSpn | undefined => {
    const key = `${this.spnPref}${spnN}`
    //let spnTemplate = this.spnCashe[key]
    return this.spnCashe[key]
  }

  getPgnTemplate = async (pgnN: number): Promise<IJ1939TemplatePgn | undefined> => {
    const key = `${this.pgnPref}${pgnN}`
    let pgnTemplate = this.pgnCashe[key]
    if (!pgnTemplate) {
      this.pgnCashe[key] = pgnTemplate = await this.Store.get(key)
      // console.log('getPgnTemplate key ', key, ' val ', pgnTemplate)
    }
    return pgnTemplate // (await this.dbPromise).get(this.storeName, ) // this.Store.get<IJ1939TemplatePgn>(`${this.pgnPref}${pgnN}`)
  }
}
