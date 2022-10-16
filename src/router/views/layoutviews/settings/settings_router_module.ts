import type { ImyRouteRecordRaw } from '@/router/router'

const settingsrouter: ImyRouteRecordRaw = {
  path: '/settings',
  component: () => import('@/layouts/AppMainV.vue'),
  name: 'Settings',
  redirect: '/files',
  meta: {
    title: 'Настройки',
    icon: 'Settings'
  },
  children: [
    {
      path: 'files',
      component: () => import('@/router/views/layoutviews/settings/JSettingsFilesV.vue'),
      name: 'Jfiles',
      meta: {
        title: 'Файлы',
        icon: 'Files',
        noCache: true,
        affix: true,
        check: () => true
      }
    },
    {
      path: 'other',
      component: () => import('@/router/views/layoutviews/settings/SetingsOtherV.vue'),
      name: 'AppSettings',
      meta: {
        hidden: false,
        title: 'Общее',
        icon: 'List',
        noCache: true,
        affix: true,
        check: () => true
      }
    },
    {
      path: 'debug',
      component: () => import('@/router/views/layoutviews/settings/DebugPageV.vue'),
      name: 'Debug',
      meta: {
        hidden: false,
        title: 'Отладка',
        icon: 'GaugeFull',
        noCache: true,
        affix: true,
        check: () => false
      }
    }
  ]
}
export default settingsrouter
