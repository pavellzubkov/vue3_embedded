import { registerIcons } from '@/components/UICommon/Icons/registerGlobIcons' // global css
import '@/styles/index.scss'
// import 'animate.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
registerIcons(app)

app.mount('#app')
