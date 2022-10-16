import { IFileIdbKey, StoreFilesClass } from '@/AAConnections/IDBStore/StoreFilesClass'
import type { IFileData } from '@/components/j1939/components/Files/Shemas/decoderData'
import { Notifications } from '@/components/UICommon/Notifications/NotificationsClass'
import Ajv, { DefinedError, ValidateFunction } from 'ajv'
import localize_ru from 'ajv-i18n/localize/ru'
import type { AnySchema } from 'ajv/dist/types'
import { saveAs } from 'file-saver'
import type { Ref } from 'vue'

export class LoadFileClass extends StoreFilesClass {
  private ajv: Ajv | null
  private validate: ValidateFunction | null
  private readonly idbKey: IFileIdbKey

  version: Ref<number> = ref(0)
  description: Ref<string> = ref('')

  constructor(idbKey: IFileIdbKey, shemas: AnySchema[]) {
    super()
    this.idbKey = idbKey
    this.ajv = new Ajv({
      schemas: shemas
    })

    this.validate = this.ajv.compile(shemas[0])
  }

  private getObjectProperty = (object, path) => {
    if (object == null) {
      // null or undefined
      return object
    }
    const parts = path.split('/')
    parts.shift()
    return parts.reduce((object, key) => object?.[key], object)
  }

  storeFile = async (fText: string): Promise<boolean> => {
    let fData: IFileData
    try {
      fData = JSON.parse(fText)
    } catch (e) {
      console.error('Cant parse JSON')
      Notifications.showNotify({
        type: 'alarm',
        duration_ms: 4000,
        title: 'Ошибка!',
        text: 'Ошибка при парсинге JSON. (неверный формат)'
      })
      return false
    }

    console.log('Files upload changes file res -', fData)
    if (!this.validate) return false
    if (this.validate(fData)) {
      // data is MyData here
      console.log('File data is shema valid!')
      const fileData = await this.updateIdbFile(this.idbKey, fData as IFileData)
      this.version.value = fileData?.version || 0
      this.description.value = fileData?.description || ''
      Notifications.showNotify({
        type: 'ok',
        duration_ms: 1500,
        title: 'Ok',
        text: 'Данные обновлены'
      })
      return true
    } else {
      console.error('File data is shema fail!', this.validate.errors)
      // ru for Russian
      localize_ru(this.validate.errors)
      // string with all errors and data paths

      console.log(this.ajv?.errorsText(this.validate.errors, { separator: '\n' }))
      for (const err of this.validate.errors as DefinedError[]) {
        console.log('Fail ', this.getObjectProperty(fData, err.instancePath))
        Notifications.showNotify({
          type: 'alarm',
          duration_ms: 7000,
          title: 'Ошибка!',
          text: `${err.instancePath} ${err.message}`
        })
      }
      return false
    }
  }

  downloadFile = async (fileName) => {
    const fData: IFileData | undefined = await this.getIdbFile(this.idbKey)
    if (!fData) return
    const version = this.filesInfo[this.idbKey]?.version || ''
    const fText = JSON.stringify(fData, undefined, 1)
    const fname = `${fileName}_v${version}.json`
    const file = new File([fText], fname, { type: 'text/plain;charset=utf-8' })
    saveAs(file)
  }

  init = async (defaultData) => {
    const fileData = await this.initIdbFile(this.idbKey, defaultData)
    this.version.value = fileData?.version || 0
    this.description.value = fileData?.description || ''
  }

  destroy = () => {
    this.ajv = null
    this.validate = null
    this.closeConnection().then().catch()
  }
}
