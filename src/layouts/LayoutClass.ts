//import '@/installCompositionApi'

import { refThrottled, useCssVar, useDark, useFullscreen, useWindowSize } from '@vueuse/core'
import { computed, ComputedRef, Ref, ref, WritableComputedRef } from 'vue'

export interface IViewRect {
  width: number
  height: number
}

export type IColorType = 'alarm' | 'warn' | 'ok'

class LayoutClass {
  private LowerThanIsMobile = 992
  public isDark: WritableComputedRef<boolean> = useDark()
  public isFullscreen = useFullscreen().isFullscreen
  public navHeight = useCssVar('--nav-bar-height', undefined, { initialValue: '50px' }) // ref('')
  public appContainerMargin = useCssVar('--app-contaiter-margin', undefined, { initialValue: '6px' }) // ref('')
  public sideMenuWidth = useCssVar('--side-menu-width', undefined, { initialValue: '0px' })
  public sideMenuExpandedWidth = useCssVar('--side-menu-expanded-width', undefined, { initialValue: '200px' })
  public appMainWindowHeight = useCssVar('--app-main-window-height', undefined, { initialValue: '600px' })
  public appMainWindowWidth = useCssVar('--app-main-window-width', undefined, { initialValue: '600px' })
  public scrW: Ref<number> = refThrottled(useWindowSize().width, 100)
  public scrH: Ref<number> = refThrottled(useWindowSize().height, 100)
  public langSelect: Ref<boolean> = ref(true)

  public isMobileAppMenuOpen: Ref<boolean> = ref(false)

  private calcViewRect = (w: number, h: number): IViewRect => {
    console.log('calcViewRect')
    if (this._isMobile.value) {
      this.sideMenuWidth.value = '0px'
    } else {
      this.sideMenuWidth.value = this.isSidebarCollapsed.value ? '0px' : this.sideMenuExpandedWidth.value
    }

    const width: number = w - Number.parseInt(this.appContainerMargin.value) * 2
    const height: number = h - Number.parseInt(this.navHeight.value) - Number.parseInt(this.appContainerMargin.value) // - Number.parseInt(this.appContainerMargin.value)

    this.appMainWindowWidth.value = `${width}px`
    this.appMainWindowHeight.value = `${height}px`
    return {
      width,
      height
    }
  }

  public viewRect: ComputedRef<IViewRect> = computed(() => this.calcViewRect(this.scrW.value, this.scrH.value))

  private _isMobile: ComputedRef<boolean> = computed(() => this.scrW.value < this.LowerThanIsMobile)

  public isDeviceMobile: ComputedRef<boolean> = computed(() => {
    if (!this._isMobile.value) {
      this.isMobileAppMenuOpen.value = false
    }
    return this._isMobile.value
  })

  public _isSidebarCollapsed: Ref<boolean> = ref(true)
  public isSidebarCollapsed = computed(() => {
    console.log('isSidebarClosedRef ', this._isSidebarCollapsed.value)
    return this._isSidebarCollapsed.value
  })

  private static instance: LayoutClass
  private constructor() {
    this.calcViewRect(this.scrW.value, this.scrH.value)
    console.log('Layout created ', this.navHeight.value, this.appContainerMargin.value)
  }

  public static getInstance(): LayoutClass {
    if (!LayoutClass.instance) {
      LayoutClass.instance = new LayoutClass()
    }
    return LayoutClass.instance
  }

  public toggleSidebar = () => {
    this._isSidebarCollapsed.value = !this._isSidebarCollapsed.value
    console.log('toggle SidebarClosed -', this.isSidebarCollapsed.value)
  }
  public closeSidebar = () => {
    this._isSidebarCollapsed.value = true
  }
}

export const Layout = LayoutClass.getInstance()
