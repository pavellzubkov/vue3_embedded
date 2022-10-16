export const RegexShorterWordsRu = /([а-яё]{1,2}[бвгджзклмнпрстфхцчшщ])(?![\sьъ])[а-яё]*/gm
export const RegexShorterWordsEn = /([a-z]{1,2}[qwrtplkjhgfdszxcvbnm])(?![\sy])[a-z]*/gm
export const RegexURLRegexp =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

export const WsMessTypeOffset = 0
export const WsJ1939ReqOffset = 1
export const WsJ1939ReqEcuOffset = 2

export enum IWsMyMessType {
  MES_J1939,
  MES_CAN_STATUS,
  MES_WiFi_STATUS,
  MES_WS_PING
}

export enum WsMessageTypeOut {
  MESS_WORK = 1,
  MESS_SET_SPEED,
  MESS_SET_GEAR,
  MESS_SEND_1939REQ
}

export enum WsMessJ1939Req {
  GET_STORED_CODES = 1,
  CLEAR_STORED_CODES
}

// api endpoints
let _wsAdr
let _baseAdr

console.log('env - ', process.env.NODE_ENV)

if (process.env.NODE_ENV !== 'development') {
  _wsAdr = 'ws://' + window.location.hostname + '/ws' // 'ws://' + window.location.hostname + '/ws'
  _baseAdr = 'http://' + window.location.hostname
} else {
  _wsAdr = 'ws://10.10.10.10/ws' // window.location.hostname
  _baseAdr = 'http://10.10.10.10' // window.location.hostname
}

console.log('env _wsAdr - ', _wsAdr)

// @ts-ignore
export const app_version = APP_VERSION

export const wsAdr = _wsAdr

export const httpBaseAdr = _baseAdr
