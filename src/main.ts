import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { validateEnv } from './utils/env'

import './styles/main.css'
import 'uno.css'

// 验证必需的环境变量是否存在,如 VITE_APP_TITLE 和 VITE_API_URL
// 如果缺少任何必需的环境变量,将抛出错误并阻止应用启动
validateEnv()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
