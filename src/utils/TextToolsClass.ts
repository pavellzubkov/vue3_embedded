import { RegexShorterWordsEn, RegexShorterWordsRu } from '@/AAAConfig/GlobConf'
import { useDateFormat } from '@vueuse/core'

class TextToolsClass {
  compactWords = (v: string, isRu: boolean, minLength = 12): string => {
    const regEx: RegExp = isRu ? RegexShorterWordsRu : RegexShorterWordsEn
    return v.length > minLength ? v.replace(regEx, '$1') : v
  }
  formatTimestamp = (ts: number): string => {
    const v = useDateFormat(ts, 'HH:mm:ss.SSS')
    const str = v.value
    return str.substring(0, str.length - 2)
  }
}
export const TextTools = new TextToolsClass()
