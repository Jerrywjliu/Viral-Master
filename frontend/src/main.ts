import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naiveui from 'naive-ui'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naiveui)

app.mount('#app')
