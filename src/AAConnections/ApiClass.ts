import { httpBaseAdr } from '@/AAAConfig/GlobConf'

async function fetchWithTimeout(resource: string, options: any) {
  const { timeout = 4000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  })
  clearTimeout(id)
  // id = null

  return response
}

type IRespType = 'text' | 'json' | 'blob'

class ApiClass {
  // private readonly myFetch: (dat: { body: { sd: number } }) => Promise<Response>
  // @ts-ignore
  private commonFetchReq = async (apiAdr: string, method: string, uri: string, data?: any, returnUrl: IRespType = 'json') => {
    const init: RequestInit = {
      method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'include', // include, *same-origin, omit
      // headers: {
      //   'Content-Type': 'nonlayoutviews/json',
      //   Authorization: `Bearer ${getToken() || ''}`,
      //   // 'Content-Type': 'nonlayoutviews/x-www-form-urlencoded',
      // },
      // redirect: 'follow', // manual, *follow, error
      // referrerPolicy: 'no-referrer', // no-referrer, *client
      body: data ? JSON.stringify(data) : undefined // body data type must match "Content-Type" header
    }
    try {
      const response = await fetchWithTimeout(apiAdr + uri, init)

      const dat = returnUrl == 'blob' ? await response.blob() : returnUrl == 'json' ? await response.json() : await response.text()
      console.log('commonFetchReq method -', method, ' uri -', uri, ' data -', data, 'resp - ', dat)
      // await RouterServiceClass.setOnline(true)
      if (dat.error) {
        // await ErrHandleService.checkErr(json)
        throw dat
        // await checkErrType(json)
      } else {
        // RouterServiceClass.online.value = true
        return returnUrl == 'blob' ? URL.createObjectURL(dat) : dat
      }
    } catch (e: any) {
      console.warn('commonFetchReq method error -', e)
      // await ErrHandleService.checkErr(e)
      throw e
    }
  }

  public getEspConfig = async () => await this.commonFetchReq(httpBaseAdr, 'GET', '/config.json')
  public uploadEspConfig = async (payload) => await this.commonFetchReq(httpBaseAdr, 'POST', '/upload/config.json', payload, 'text')
}

export const ApiClassInst = new ApiClass()
