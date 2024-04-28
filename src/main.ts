import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import i18n from '@/i18n/i18n.config'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
