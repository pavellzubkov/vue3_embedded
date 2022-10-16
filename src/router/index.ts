import type { ImyRouteRecordRaw } from '@/router/router'
import settingsrouter from '@/router/views/layoutviews/settings/settings_router_module'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routeNames = [
  'Redirect',
  'RedirectEnd',
  'JGraphFull',
  '404',
  'Layout',
  'J1939',
  'JStoredCodes',
  'JActiveCodes',
  'JGraph',
  'Settings',
  'Jfiles',
  'AppSettings',
  'Debug',
  'null'
] as const

export type IRouteNames = typeof routeNames[number]

export const fullScreenRoutes: ImyRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: () => import('@/layouts/AppLayoutsV.vue'),
    meta: { hidden: true },
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/router/views/nonlayoutviews/RedirectV.vue'),
        name: 'RedirectEnd',
        meta: { hidden: true }
      }
    ]
  },
  {
    path: '/graphFull',
    component: () => import('@/router/views/layoutviews/J1939GraphV.vue'),
    name: 'JGraphFull',
    meta: {
      hidden: true,
      title: 'График',
      icon: 'LineGraph',
      noCache: true,
      affix: true,
      check: () => true
    }
  },
  {
    path: '/404',
    component: () => import('@/router/views/nonlayoutviews/404V.vue'),
    name: '404',
    meta: { hidden: false }
  }
]

export const layoutRoutes: ImyRouteRecordRaw[] = [
  /* when your routing map is too long, you can split it into small modules */
  {
    path: '/',
    component: () => import('@/layouts/AppLayoutsV.vue'),
    redirect: '/j1939',
    meta: { hidden: false },
    name: 'Layout',
    children: [
      {
        path: '/j1939',
        component: () => import('@/router/views/layoutviews/J1939DataV.vue'),
        name: 'J1939',
        meta: {
          hidden: false,
          title: 'Параметры',
          icon: 'Engine',
          noCache: true,
          affix: true,
          check: () => true
        }
      },
      {
        path: '/storedcodes',
        component: () => import('@/router/views/layoutviews/JStoredCodesV.vue'),
        name: 'JStoredCodes',
        meta: {
          hidden: false,
          title: 'Ошибки история',
          icon: 'CodesStored',
          noCache: true,
          affix: true,
          check: () => true
        }
      },
      {
        path: '/activecodes',
        component: () => import('@/router/views/layoutviews/JActiveCodesV.vue'),
        name: 'JActiveCodes',
        meta: {
          hidden: true,
          title: 'Ошибки активные',
          icon: 'CodesActive',
          noCache: true,
          affix: true,
          check: () => true
        }
      },
      {
        path: '/graph',
        component: () => import('@/router/views/layoutviews/J1939GraphV.vue'),
        name: 'JGraph',
        meta: {
          hidden: false,
          title: 'График',
          icon: 'LineGraph',
          noCache: true,
          affix: true,
          check: () => true
        }
      },
      settingsrouter
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)*', name: 'null', redirect: '/404', meta: { hidden: true } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...fullScreenRoutes, ...layoutRoutes] as RouteRecordRaw[],
  sensitive: false
})

export default router
