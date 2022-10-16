import type { IRegisteredIconsNames } from '@/components/UICommon/Icons/registerGlobIcons'
import type { IRouteNames } from '@/router/index'
import { RouteComponent, RouteLocationNormalized, RouteMeta, _RouteRecordBase } from 'vue-router'

export interface IRouteMeta extends RouteMeta {
  hidden?: boolean
  title?: string
  icon?: IRegisteredIconsNames
  noCache?: boolean
  affix?: boolean
  check?: RouteCheckFunc
}

export interface IMyRouteRecBase extends _RouteRecordBase {
  component?: RouteComponent
  name: IRouteNames
  children?: ImyRouteRecordRaw[]
  meta: IRouteMeta
}

export declare type ImyRouteRecordRaw = IMyRouteRecBase

export interface IAppState {
  state: 'offline' | 'online'
  to?: RouteLocationNormalized
}

export type RouteCheckFunc = () => boolean
