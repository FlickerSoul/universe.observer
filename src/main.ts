import './styles/global.sass'
import './styles/md.sass'
import 'katex/dist/katex.min.css'
import 'uno.css'
import autoRoutes from 'virtual:generated-pages'
import { createPinia } from 'pinia'
import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import type { App, Plugin } from 'vue'
import FloatingVue from 'floating-vue'
import {
  addHtmlExtension,
  addMultiLangPages,
  redirectAll,
} from '../scripts/routing-support'
import Application from './App.vue'

const routes = redirectAll(addHtmlExtension(addMultiLangPages(autoRoutes)))

function scrollBehavior(to: any, from: any, savedPosition: any) {
  if (savedPosition) return savedPosition
  else return { top: 0 }
}

export type FloatingVueConfig = Parameters<(typeof FloatingVue)['install']>[1]

const UseFloatingVue: Plugin<FloatingVueConfig> = {
  install(app: App, options: FloatingVueConfig = {}) {
    app.use(FloatingVue, {
      ...options,
      themes: {
        bril: {
          $extend: 'dropdown',
          triggers: ['hover', 'touch'],
          popperTriggers: ['hover', 'touch'],
          placement: 'bottom-start',
          overflowPadding: 10,
          delay: 0,
          handleResize: false,
          autoHide: true,
          instantMove: false,
          flip: false,
          arrowPadding: 8,
          autoBoundaryMaxSize: true,
        },
        ...options.themes,
      },
    })
  },
}

export const createApp = ViteSSG(
  Application,
  { routes, scrollBehavior },
  ({ app, router, isClient }) => {
    const pinia = createPinia()
    app.use(pinia)
    app.use(UseFloatingVue)

    if (isClient) {
      router.beforeEach(() => {
        NProgress.start()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  },
)
