import type { App } from 'vue'
import Plus from '~icons/fluent/add-circle-24-filled'
import Update from '~icons/fluent/arrow-counterclockwise-20-filled'
import Download from '~icons/fluent/arrow-download-16-filled'
import Upload from '~icons/fluent/arrow-upload-16-filled'
import Checked from '~icons/fluent/checkmark-circle-12-filled'
import Delete from '~icons/fluent/delete-32-filled'
import CodesActive from '~icons/fluent/error-circle-12-regular'
import Filter from '~icons/fluent/filter-12-filled'
import FullScreenMax from '~icons/fluent/full-screen-maximize-16-filled'
import FullScreenMin from '~icons/fluent/full-screen-minimize-16-filled'
import CodesStored from '~icons/fluent/history-dismiss-24-filled'
import Pause from '~icons/fluent/pause-20-filled'
import Play from '~icons/fluent/play-20-filled'
import ConnectOk from '~icons/fluent/plug-connected-checkmark-20-filled'
import ConnectFail from '~icons/fluent/plug-disconnected-20-filled'
import LineGraphIn from '~icons/fluent/pulse-32-filled'
import LineGraph from '~icons/fluent/pulse-square-24-regular'
import Question from '~icons/fluent/question-circle-12-filled'
import Settings from '~icons/mdi/cog'
import Engine from '~icons/mdi/engine'
import Files from '~icons/mdi/file-arrow-up-down'
import GaugeFull from '~icons/mdi/gauge-full'
import Mqtt from '~icons/mdi/home-automation'
import Menu from '~icons/mdi/microsoft-xbox-controller-menu'
import MdiStore24Hour from '~icons/mdi/store-24-hour'
import List from '~icons/mdi/view-list'
import Wifi from '~icons/mdi/wifi'

export type IRegisteredIconsNames = keyof typeof _RegisteredIcons

export const _RegisteredIcons = {
  MdiStore24Hour,
  LineGraph,
  LineGraphIn,
  GaugeFull,
  Settings,
  ConnectOk,
  ConnectFail,
  CodesStored,
  CodesActive,
  FullScreenMax,
  FullScreenMin,
  Delete,
  Filter,
  Engine,
  Play,
  Pause,
  Wifi,
  Mqtt,
  Update,
  List,
  Menu,
  Files,
  Upload,
  Download,
  Checked,
  Question,
  Plus
}

export const registerIcons = (app: App) => {
  Object.keys(_RegisteredIcons).forEach((name) => {
    app.component(name, _RegisteredIcons[name])
  })
}
