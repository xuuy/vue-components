import { createApp } from 'vue'
import App from './App'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import 'uno.css'

const app = createApp(App)
app.use(Antd)
app.mount('#app')
