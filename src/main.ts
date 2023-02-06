import './styles/global.sass'
import './styles/md.sass'
import 'katex/dist/katex.min.css'
import autoRoutes from 'virtual:generated-pages'
import { ViteSSG } from 'vite-ssg'
import NProgress from 'nprogress'
import App from './App.vue'
import 'uno.css'

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  }
})

export const createApp = ViteSSG(
  App,
  { routes },
  ({ router, isClient }) => {
    if (isClient) {
      router.beforeEach(() => {
        NProgress.start()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  })

// createApp(App).mount('#app')
