import { IWsMyMessType, wsAdr, WsMessTypeOffset } from '@/AAAConfig/GlobConf'
import { FakeJ1939 } from '@/components/j1939/components/FakeMessages/FakeJ1939Class'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'
import { useWebSocket, WebSocketStatus } from '@vueuse/core'
import { computed, Ref, ref } from 'vue'

export type IWsSend = (data: string | ArrayBuffer | Blob | DataView, useBuffer?: boolean) => boolean

export class WebsClass {
  private ws: WebSocket | undefined
  private readonly send: IWsSend
  private _wsStatus: Ref<WebSocketStatus> = ref('CLOSED')
  public wsStatus: Ref<WebSocketStatus> = computed((): WebSocketStatus => {
    return this._wsStatus.value
  })
  static instance: WebsClass

  constructor() {
    const reconnect =
      process.env.NODE_ENV === 'deploy'
        ? false
        : {
            delay: 5000
          }
    const { status, send } = useWebSocket(wsAdr, {
      autoReconnect: reconnect,
      heartbeat: false,
      onMessage: this.onMess,
      onConnected: this.onOpen,
      onError: this.onErr
    })

    this.send = send as IWsSend
    this._wsStatus = status
  }

  public static getInstance(): WebsClass {
    if (!WebsClass.instance) {
      WebsClass.instance = new WebsClass()
    }
    return WebsClass.instance
  }

  messCount: Ref<number> = ref(0)

  public sendMess = (data: string | ArrayBuffer | Blob | DataView, useBuffer?: boolean): void => {
    if (!this.ws) return
    if (this.ws.readyState == 1) this.send(data)
  }

  private onOpen = (ws: WebSocket) => {
    console.log('WebsClass ws on open ')
    this.ws = ws
    this.ws.binaryType = 'arraybuffer'
  }

  private readJ1939(buf: ArrayBuffer) {
    FakeJ1939.stop()
    const view = new DataView(buf)
    J1939decoder.decodeInpArray(view)
      .then((v) => null)
      .catch(() => {
        console.log('ws mess err')
      })
      .finally(() => null)
  }

  private onMess = (ws: WebSocket, ev: MessageEvent) => {
    let view: DataView | null = new DataView(ev.data)
    const mesType: IWsMyMessType = view.getUint8(WsMessTypeOffset)
    this.messCount.value++
    switch (mesType) {
      case IWsMyMessType.MES_J1939: {
        this.readJ1939(ev.data.slice(0))
        view = null
        break
      }
      case IWsMyMessType.MES_CAN_STATUS: {
        //statements;
        break
      }
      case IWsMyMessType.MES_WiFi_STATUS: {
        //statements;
        break
      }
      // case IWsMyMessType.MES_WS_PING: {
      //   this.resetTimeoutConnection()
      //   break
      // }
      default: {
        //statements;
        break
      }
    }
  }

  private onErr = (ws: WebSocket, event: Event) => {
    console.log('WebsClass ws on err ')
  }
}

export const WebSocketInst = WebsClass.getInstance()
