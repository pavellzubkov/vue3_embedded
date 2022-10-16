import { IdbWrapperClass } from '@/AAConnections/IDBStore/IdbWrapperClass'
import { aliasesDefault } from '@/components/j1939/components/Files/Shemas/aliacesDefault'
import type { IFileData } from '@/components/j1939/components/Files/Shemas/decoderData'
import { decoderDefault } from '@/components/j1939/components/Files/Shemas/decoderDefault'
import { j1939errorsDefault } from '@/components/j1939/components/Files/Shemas/j1939errorsDefault'

//export type IFileIdbKey = 'j1939decoder' | 'j1939aliaces' | 'j1939errors'

export type IFileIdbKey = keyof typeof FilesDefault

export const FilesDefault = {
  j1939decoder: decoderDefault,
  j1939aliaces: aliasesDefault,
  j1939errors: j1939errorsDefault
}

export type IFilesInfo = {
  [k in IFileIdbKey]?: IFileData
}

export class StoreFilesClass {
  filesInfo: IFilesInfo = {}

  private Store: IdbWrapperClass | null

  constructor() {
    this.Store = new IdbWrapperClass()
  }

  public closeConnection = async () => {
    await this.Store?.close()
    this.Store = null
    return true
  }

  private getFileVersion = async (idbKey): Promise<IFileData> => {
    const version = await this.Store?.get(`${idbKey}_version`)
    const description = await this.Store?.get(`${idbKey}_description`)
    if (!version || !description) throw { message: 'Empty file ' }
    return {
      version,
      description
    }
  }

  initIdbFile = async (idbKey: IFileIdbKey, def: IFileData): Promise<IFileData> => {
    const out: IFileData = {
      version: def.version,
      description: def.description
    }

    try {
      const fVer = await this.getFileVersion(idbKey)
      out.version = fVer.version
      out.description = fVer.description
      console.log('initIdbFile exist ', out)
      return out
    } catch (e) {
      console.log('initIdbFile set file by def ')
      try {
        await this.updateIdbFile(idbKey, def)

        return out
      } catch (e) {
        console.error('cant store object to idb')
      }
    }
    return out
  }

  updateIdbFile = async (idbKey: IFileIdbKey, data: IFileData): Promise<IFileData | undefined> => {
    try {
      await this.Store?.set(`${idbKey}_version`, data.version)
      await this.Store?.set(`${idbKey}_description`, data.description)
      await this.Store?.set(idbKey, data)
      return data
    } catch (e) {
      console.error('cant store object to idb')
      return data
    }
  }

  getIdbFile = async (idbKey: IFileIdbKey): Promise<IFileData | undefined> => {
    try {
      return (await this.Store?.get(idbKey)) as IFileData
    } catch (e) {
      console.error('cant get file from idb', idbKey)
      return undefined
    }
  }

  initAndGetFile = async (idbKey: IFileIdbKey): Promise<IFileData | undefined> => {
    const def = FilesDefault[idbKey]
    this.filesInfo[idbKey] = await this.initIdbFile(idbKey, def)
    return await this.getIdbFile(idbKey)
  }
}
