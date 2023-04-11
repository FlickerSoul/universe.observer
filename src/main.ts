import './styles/global.sass'
import './styles/md.sass'
import 'katex/dist/katex.min.css'
import 'uno.css'
import routes from 'virtual:generated-pages'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'

const scrollBehavior = (to: any, from: any, savedPosition: any) => {
  if (savedPosition)
    return savedPosition
  else
    return { top: 0 }
}

const app = createApp(App)
const head = createHead()
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior,
})
router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})

app.use(head)
app.use(pinia)
app.use(router)
app.mount('#app')
