import { resolve } from 'path'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import imports from 'unplugin-auto-import/vite'
import matter from 'gray-matter'
import markdown from 'unplugin-vue-markdown/vite'
import anchor from 'markdown-it-anchor'
import linkattr from 'markdown-it-link-attributes'
import toc from 'markdown-it-table-of-contents'
import unocss from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'
import components from 'unplugin-vue-components/vite'
import katex from '@uniob/markdown-it-katex'
import sup from 'markdown-it-sup'
import sub from 'markdown-it-sub'
import mark from 'markdown-it-mark'
import Inspect from 'vite-plugin-inspect'
import generateSitemap from 'vite-plugin-pages-sitemap'
import type { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'
import MarkdownItShiki from '@shikijs/markdown-it'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { slugify } from './scripts/routing-support'
import { checkCustomComponent, katexOptions } from './scripts/tex-defs'
import type { Options as CodeFenceOptions } from './scripts/markdown-code-fence'
import customCodeFence from './scripts/markdown-code-fence'
import retainMermaid from './scripts/markdown-mermaid'
import wrapMagnifier from './scripts/markdown-img-wrapper'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      // rename imports
      { find: '~/', replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
  },
  appType: 'spa',
  plugins: [
    // vue
    vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        compilerOptions: {
          isCustomElement: checkCustomComponent,
        },
      },
    }),
    // unocss styling
    unocss({
      presets: [
        presetIcons(),
        presetAttributify(),
        presetUno(),
        presetWebFonts({
          fonts: {
            sans: [{ name: 'Inter', weights: [400, 500, 600], italic: true }],
            mono: ['JetBrains Mono', 'monospace'],
          },
        }),
      ],
      transformers: [transformerDirectives()],
    }),
    imports({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        '@vueuse/head',
      ],
    }),
    // handling markdown and vue pages routing
    pages({
      extensions: ['vue', 'md'],
      dirs: ['pages', 'projects'],
      exclude: ['**/components/*.vue'],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))
        const md = fs.readFileSync(path, 'utf-8')
        const data = matter(md, { excerpt_separator: '<!-- more -->' })
        route.meta = Object.assign(route.meta || {}, {
          frontmatter: {
            ...data.data,
            excerpt: data.excerpt,
            createdAt: data.data.createdAt ? new Date(data.data.createdAt) : undefined,
            updatedAt: data.data.updatedAt ? new Date(data.data.updatedAt) : undefined,
            get description(): string {
              return data.data.description || this.abstract || this.excerpt
            },
          },
        })

        return route
      },
      onRoutesGenerated(routes: RouteRecordRaw[]) {
        generateSitemap({
          hostname: 'https://universe.observer',
          routes: routes.filter((r: RouteRecordNormalized) => {
            if (r.meta?.frontmatter)
              return r.meta.frontmatter.hidden !== true
            return true
          }),
        })

        return routes
      },
    }),
    markdown({
      wrapperComponent: 'Post',
      wrapperClasses: 'post-md-content',
      markdownItOptions: {
        linkify: true,
        quotes: '""\'\'',
      },
      exposeFrontmatter: false,
      exportFrontmatter: false,
      frontmatter: true,
      async markdownItSetup(md) {
        md.use(await MarkdownItShiki({
          themes: {
            dark: 'nord',
            light: 'rose-pine-dawn',
          },
          defaultColor: false,
          cssVariablePrefix: '--shiki-',
          transformers: [transformerMetaHighlight()],
        }))
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
        md.use(katex, katexOptions)
        md.use(sup)
        md.use(sub)
        md.use(mark)
        md.use<CodeFenceOptions>(customCodeFence, { wrappingTag: 'div' })
        md.use(retainMermaid)
        md.use(wrapMagnifier)
      },
    }),
    components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    process.env.NODE_ENV === 'production' ? null : Inspect(),
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
  ssgOptions: {
    formatting: 'minify',
  },
})
