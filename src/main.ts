import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { validateEnv } from './utils/env'

import './assets/main.css'

// 验证环境变量
validateEnv()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
