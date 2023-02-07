import { resolve } from 'path'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import imports from 'unplugin-auto-import/vite'
import matter from 'gray-matter'
import markdown from 'vite-plugin-vue-markdown'
import shiki from 'markdown-it-shiki'
import anchor from 'markdown-it-anchor'
import linkattr from 'markdown-it-link-attributes'
import toc from 'markdown-it-table-of-contents'
import unocss from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'
import components from 'unplugin-vue-components/vite'
import katex from '@uniob/markdown-it-katex/dist'
import transformerDirectives from '@unocss/transformer-directives'
import sup from 'markdown-it-sup'
import sub from 'markdown-it-sub'
import { slugify } from './scripts/slug'

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
  appType: 'spa',
  plugins: [
    // vue
    vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),
    // unocss styling
    unocss({
      presets: [
        presetIcons(),
        presetAttributify(),
        presetUno(),
        presetWebFonts({
          fonts: {
            sans: [{ name: 'Inter', weights: [400, 600, 800], italic: true }],
            mono: ['JetBrains Mono', 'monospace'],
          },
        }),
      ],
      transformers: [transformerDirectives()],
    }),
    imports({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@vueuse/head',
      ],
    }),
    // handling markdown and vue pages routing
    pages({
      extensions: ['vue', 'md'],
      dirs: ['pages'],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))
        const md = fs.readFileSync(path, 'utf-8')
        const data = matter(md)
        route.meta = Object.assign(route.meta || {}, { frontmatter: data.data })

        return route
      },
    }),
    markdown({
      wrapperComponent: 'Post',
      wrapperClasses: 'post-md-content',
      headEnabled: true,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      markdownItSetup(md) {
        md.use(shiki, {
          theme: {
            dark: 'nord',
            light: 'rose-pine-dawn',
          },
        })
        md.use(anchor, {
          slugify,
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
          slugify,
          includeLevel: [1, 2, 3, 4],
        })
        md.use(katex)
        md.use(sup)
        md.use(sub)
      },
    }),
    components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
