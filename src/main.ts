import './style.css'
import autoRoutes from 'virtual:generated-pages'
import { ViteSSG } from 'vite-ssg'
// import NProgress from 'nprogress'
import App from './App.vue'

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

  })

// createApp(App).mount('#app')
