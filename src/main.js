import './assets/global.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
import { useUserStore } from './stores/user'
import 'es6-promise/auto'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus,{ locale: zhCn })
app.use(router)
app.use(pinia)
const userStore = useUserStore();
userStore.initialize();

app.mount('#app')



