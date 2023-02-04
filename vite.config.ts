import { resolve } from 'path'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import matter from 'gray-matter'
import markdown from 'vite-plugin-vue-markdown'
import shiki from 'markdown-it-shiki'
import anchor from 'markdown-it-anchor'
import linkattr from 'markdown-it-link-attributes'
import toc from 'markdown-it-table-of-contents'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      // rename imports
      { find: '~/', replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core'],
  },
  // ssgOptions: {
  //   formatting: 'minify',
  //   format: 'cjs',
  // },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),
    pages({
      extensions: ['vue', 'md'],
      dirs: ['pages'],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        if (!path.includes('home.md')) {
          const md = fs.readFileSync(path, 'utf-8')
          const data = matter(md)
          route.meta = Object.assign(route.meta || {}, { header: data.data })
        }

        return route
      },
    }),
    markdown({
      wrapperComponent: 'post',
      // TODO: add wrapper class names
      headEnabled: true,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      markdownItSetup(md) {
        md.use(shiki, {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
        })
        md.use(anchor, {
          // TODO: add slug translator
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })
        md.use(linkattr, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(toc, {
          // TODO: add slug translator
          includeLevel: [1, 2, 3],
        })
      },
    }),
  ],

})
