import { createApp } from 'vue'
import App from './App'
import router from './router'
import './assets/styles/app.css'

// Create Vue app instance
const app = createApp(App)

// Use router
app.use(router)

// Mount app
app.mount('#app')
