import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './plugin/axios.js'

createApp(App).config.globalProperties.$axios = api
createApp(App).use(router).mount('#app')
