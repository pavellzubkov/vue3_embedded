import { useLocalStorage } from '@vueuse/core'
import type { Ref } from 'vue'
import { ref } from 'vue'

class GlobStateClass {
  dialogGlobOpen: Ref<boolean> = ref(false)

  private static instance: GlobStateClass
  private constructor() {
    console.log('GlobStateClass created')
  }

  public static getInstance(): GlobStateClass {
    if (!GlobStateClass.instance) {
      GlobStateClass.instance = new GlobStateClass()
    }
    return GlobStateClass.instance
  }

  fakeGenIsEnabled = useLocalStorage('fakeGenIsEnabled', true)
}

export const GlobStateInst = GlobStateClass.getInstance()
