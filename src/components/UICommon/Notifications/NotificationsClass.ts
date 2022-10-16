import type { IColorType } from '@/layouts/LayoutClass'
import type { Ref } from 'vue'

export interface INotificationShort {
  type: IColorType
  duration_ms: number
  title: string
  text: string
}

export interface INotificationFull extends INotificationShort {
  id: number
}

class NotificationsClass {
  private intervalId
  private _clearNotifiByTimeout = () => {
    if (this.notificationList.value.length === 0) return
    this.notificationList.value = this.notificationList.value.filter((n) => {
      const dif = Date.now() - (n.id + n.duration_ms)
      console.log('not.ts ', dif)
      return dif < 0
    })
  }
  notificationList: Ref<INotificationFull[]> = ref([])
  constructor() {
    this.intervalId = setInterval(this._clearNotifiByTimeout, 100)
  }
  showNotify = (n: INotificationShort) => {
    const full: INotificationFull = {
      id: Date.now(),
      type: n.type,
      duration_ms: n.duration_ms,
      text: n.text,
      title: n.title
    }
    this.notificationList.value.unshift(full)
  }
  deleteNotifi = (nId: number) => {
    const notIndex = this.notificationList.value.findIndex((n) => n.id === nId)
    if (notIndex > -1) this.notificationList.value.splice(notIndex, 1)
  }
  isShowing = () => this.notificationList.value.length > 0
}
export const Notifications = new NotificationsClass()
