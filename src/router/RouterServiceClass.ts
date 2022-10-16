import { GlobStateInst } from '@/GlobStateClass'
import { Layout } from '@/layouts/LayoutClass'
import router, { IRouteNames, layoutRoutes } from '@/router/index'
import type { IMyRouteRecBase, ImyRouteRecordRaw, IRouteMeta } from '@/router/router'
import type { Ref } from 'vue'
import { ref } from 'vue'

export type IGoToName = (routeName: IRouteNames) => void

class RouterServiceClass {
  acessibleRoutes: Ref<ImyRouteRecordRaw[]> = ref([])
  online: Ref<boolean> = ref(true)
  private r = router
  private unwrapRoutes = (array: ImyRouteRecordRaw[]): ImyRouteRecordRaw[] => {
    let res: ImyRouteRecordRaw[] = []
    array.forEach((el) => {
      if (el.children) {
        const tmp = this.unwrapRoutes(el.children)
        res = res.concat(tmp)
      } else {
        res.push(el)
      }
    })
    return res
  }

  public goToName: IGoToName = (routeName: IRouteNames) => {
    GlobStateInst.dialogGlobOpen.value = false
    Layout.closeSidebar()
    this.r.push({ name: routeName }).then().catch()
  }

  private hasPermission = (roles, route: IMyRouteRecBase): boolean => {
    if (route.meta && route.meta.check) {
      const meta = route.meta as IRouteMeta
      if (!meta.check) return true
      return meta.check()
    } else {
      return true
    }
  }

  private filterAsyncRoutes = (routes: ImyRouteRecordRaw[], roles: string[]): ImyRouteRecordRaw[] => {
    const res: ImyRouteRecordRaw[] = []
    routes.forEach((route) => {
      const tmp = { ...route }
      // console.log('Filter async routes -', tmp)
      if (this.hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = this.filterAsyncRoutes(tmp.children, roles)
        }
        res.push(tmp)
      }
    })
    return res
  }

  private filterPermitRoutes = (roles: string[]): ImyRouteRecordRaw[] => {
    console.info('filterPermitRoutes. roles- ', roles)
    let accessedRoutes: ImyRouteRecordRaw[]
    if (!layoutRoutes[0].children) return []
    if (roles.includes('admin')) {
      accessedRoutes = layoutRoutes[0].children
    } else {
      accessedRoutes = this.filterAsyncRoutes(layoutRoutes[0].children, roles)
    }
    console.info('filterPermitRoutes generateRoutes - ', accessedRoutes)
    return accessedRoutes
  }

  setAcessibleRoutes(roles: string[]) {
    this.acessibleRoutes.value = this.filterPermitRoutes(roles)
    console.log('RouterServiceClass setAcessibleRoutes -', this.r.getRoutes())
  }
}
export const RouterService = new RouterServiceClass()
