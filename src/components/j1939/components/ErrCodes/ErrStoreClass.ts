import { IdbWrapperClass } from '@/AAConnections/IDBStore/IdbWrapperClass'
import type { IJ1939errorFmi, IJ1939errorsFile, IJ1939errorSpn } from '@/components/j1939/components/Files/Shemas/j1939errorsDefault'

interface IErrSpnCasheObj {
  [key: string]: IJ1939errorSpn | undefined
}

interface IErrFmiCacheObj {
  [k: string]: IJ1939errorFmi | undefined
}

export class ErrStoreClass {
  private spnPref = 'spn_'
  private fmiPref = 'fmi_'
  private Store: IdbWrapperClass
  private storeName = 'errcodes'
  private baseName = ''
  private spnCashe: IErrSpnCasheObj = {}
  private fmiCashe: IErrFmiCacheObj = {}

  constructor(baseName: string) {
    this.baseName = baseName
    this.Store = new IdbWrapperClass(baseName, this.storeName)
  }

  private setRecs = async (k: [IDBValidKey, any][]): Promise<void> => {
    return await this.Store.setMany(k)
  }

  reInitStore = async (fObj: IJ1939errorsFile): Promise<void> => {
    await this.Store.clear()
    const spnsRecs: [IDBValidKey, any][] = fObj.spns.map((spn) => [`${this.spnPref}${spn.spn}`, spn])
    const fmisRecs: [IDBValidKey, any][] = fObj.fmis.map((fmi) => [`${this.fmiPref}${fmi.fmi}`, fmi])
    await this.setRecs(spnsRecs)
    await this.setRecs(fmisRecs)
  }

  getSpnData = async (spnN: number): Promise<IJ1939errorSpn> => {
    const key = `${this.spnPref}${spnN}`
    let spnTemplate = this.spnCashe[key]
    if (!spnTemplate) {
      this.spnCashe[key] = spnTemplate = (await this.Store.get(key)) || { spn: 0, name_en: 'No data', name_ru: 'Нет данных' }
    }
    return spnTemplate
  }
  getFmiData = async (fmiN: number): Promise<IJ1939errorFmi> => {
    const key = `${this.fmiPref}${fmiN}`
    let fmiTemplate = this.fmiCashe[key]
    if (!fmiTemplate) {
      this.fmiCashe[key] = fmiTemplate = (await this.Store.get(key)) || { fmi: 0, name_en: 'No data', name_ru: 'Нет данных' }
    }
    return fmiTemplate
  }
}
