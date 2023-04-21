import './styles/global.sass'
import './styles/md.sass'
import 'katex/dist/katex.min.css'
import 'uno.css'
import autoRoutes from 'virtual:generated-pages'
import { createPinia } from 'pinia'
import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import { addHtmlExtension, addMultiLangPages, redirectAll } from '../scripts/routing-support'
import App from './App.vue'

const routes = redirectAll(
  addHtmlExtension(
    addMultiLangPages(
      autoRoutes,
    ),
  ),
)

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
