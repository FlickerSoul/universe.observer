import {resolve} from 'node:path'
import * as fs from 'node:fs'
import * as process from 'node:process'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import imports from 'unplugin-auto-import/vite'
import matter from 'gray-matter'
import markdown from 'unplugin-vue-markdown/vite'
import anchor from 'markdown-it-anchor'
import linkattr from 'markdown-it-link-attributes'
import toc from 'markdown-it-table-of-contents'
import unocss from 'unocss/vite'
import {presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives} from 'unocss'
import components from 'unplugin-vue-components/vite'
import katex from '@uniob/markdown-it-katex'
import sup from 'markdown-it-sup'
import sub from 'markdown-it-sub'
import mark from 'markdown-it-mark'
import Inspect from 'vite-plugin-inspect'
import generateSitemap from 'vite-plugin-pages-sitemap'
import type {RouteRecordNormalized, RouteRecordRaw} from 'vue-router'
import MarkdownItShiki from '@shikijs/markdown-it'
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import {slugify} from './scripts/routing-support'
import {checkCustomComponent, katexOptions} from './scripts/tex-defs'
import {customFenceWrapper, retainMermaid} from './scripts/markdown-custom-fences'
import wrapMagnifier from './scripts/markdown-img-wrapper'
import ViteLoadString from './scripts/vite-load-string'
import {BrilTransformerFactory} from './scripts/BrilTransformer'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      // rename imports
      {find: '~/', replacement: `${resolve(__dirname, 'src')}/`},
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
            sans: [{name: 'Inter', weights: [400, 500, 600], italic: true}],
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
      exclude: ['**/components/**/*.vue'],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))
        const md = fs.readFileSync(path, 'utf-8')
        const data = matter(md, {excerpt_separator: '<!-- more -->'})
        route.meta = Object.assign(route.meta || {}, {
          frontmatter: {
            ...data.data,
            excerpt: data.excerpt.length > 0 ? data.excerpt : undefined,
            get description(): string | undefined {
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
      wrapperComponent: (id) => {
        if (id.includes('components'))
          return undefined
        return 'Post'
      },
      wrapperClasses: (id) => {
        if (id.includes('components'))
          return undefined
        return 'post-md-content'
      },
      escapeCodeTagInterpolation: false,
      markdownItOptions: {
        linkify: true,
        quotes: '""\'\'',
      },
      exposeFrontmatter: false,
      exportFrontmatter: false,
      frontmatter: true,
      async markdownItSetup(md) {
        const shikiPlugin = await (async () => {
          const bril = JSON.parse(fs.readFileSync('./scripts/bril-textmate.json', 'utf8'))
          const nord = JSON.parse(fs.readFileSync('./scripts/nord.json', 'utf8'))
          const rosePineDawn = JSON.parse(fs.readFileSync('./scripts/rose-pine-dawn.json', 'utf8'))

          return MarkdownItShiki({
            themes: {
              dark: nord,
              light: rosePineDawn,
            },
            langs: ['typescript', 'c++', 'python', 'markdown', 'latex', 'swift', 'kotlin', bril],
            defaultColor: false,
            cssVariablePrefix: '--shiki-',
            transformers: [
              transformerMetaHighlight(),
              transformerNotationDiff(),
              transformerNotationErrorLevel(),
              transformerNotationHighlight(),
              transformerNotationFocus(),
              ...await BrilTransformerFactory(bril, nord, rosePineDawn),
            ],
          })
        })()

        md.use(shikiPlugin)
        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '🔗',
            renderAttrs: () => ({'aria-hidden': 'true'}),
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
        md.use(customFenceWrapper)
        md.use(retainMermaid)
        md.use(wrapMagnifier)
        md.use(MarkdownItGitHubAlerts)
      },
    }),
    components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      globs: ['**/components/**/*.vue'],
    }),
    ViteLoadString(),
    process.env.NODE_ENV === 'production' ? null : Inspect(),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
})
