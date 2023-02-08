import './styles/global.sass'
import './styles/md.sass'
import 'katex/dist/katex.min.css'
import autoRoutes from 'virtual:generated-pages'
import { ViteSSG } from 'vite-ssg'
import NProgress from 'nprogress'
import App from './App.vue'
import 'uno.css'
import { createPinia } from 'pinia'

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  }
})

const scrollBehavior = (to: any, from: any, savedPosition: any) => {
  if (savedPosition)
    return savedPosition
  else
    return { top: 0 }
}

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app, router, isClient }) => {
    const pinia = createPinia()
    app.use(pinia)

    if (isClient) {
      router.beforeEach(() => {
        NProgress.start()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  })
