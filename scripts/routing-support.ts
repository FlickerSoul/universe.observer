import { remove } from 'diacritics'
import type { RouteRecordRaw } from 'vue-router'
import { DEFAULT_LANG, SupportedLangs } from './lang'

// eslint-disable-next-line no-control-regex
const rControl = /[\u0000-\u001F]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g

export const slugify = (str: string): string => {
  return (
    remove(str)
      // Remove control characters
      .replace(rControl, '')
      // Replace special characters
      .replace(rSpecial, '-')
      // Remove continuos separators
      .replace(/-{2,}/g, '-')
      // Remove prefixing and trailing separtors
      .replace(/^-+|-+$/g, '')
      // ensure it doesn't start with a number (#121)
      .replace(/^(\d)/, '_$1')
      // lowercase
      .toLowerCase()
  )
}

export function addHtmlExtension(routes: RouteRecordRaw[]) {
  return routes.map(route => (
    {
      ...route,
      alias: route.path.endsWith('/')
        ? `${route.path}index.html`
        : `${route.path}.html`,
    }
  ))
}

function generateBaseMatchingRegex() {
  return new RegExp(`^(.*?)(${Object.values(SupportedLangs).join('|')})\$`)
}

const BASE_MATCHING_REGEX = generateBaseMatchingRegex()

export function matchMultiLangBase(path: string) {
  return path.match(BASE_MATCHING_REGEX)
}

function getMultiLangBase({ path }: RouteRecordRaw): [string, string] | undefined {
  const matched = matchMultiLangBase(path)
  if (matched)
    return [matched[1], matched[2]]
  else
    return undefined
}

function ensureSlashEnding(path: string) {
  return path.endsWith('/') ? path : `${path}/`
}

function addRedirectToRoutes(routes: RouteRecordRaw[], mapping: Map<string, Map<string, RouteRecordRaw>>) {
  mapping.forEach((langMap, base) => {
    const langs = [...langMap.keys()]
    const defaultLang = langMap.has(DEFAULT_LANG) ? DEFAULT_LANG : langs[0]
    const defaultRoute = langMap.get(defaultLang)

    for (const route of langMap.values()) {
      route.meta.frontmatter.display = false
      route.meta.frontmatter.lang = undefined
      route.meta.frontmatter.langs = [...langs]
    }

    const newRoute: RouteRecordRaw = {
      path: base,
      name: base,
      children: [],
      meta: {
        // recreate frontmatter for display purpose
        frontmatter: {
          ...defaultRoute.meta.frontmatter,
          display: true,
          langs: [...langs],
          get description(): string {
            return this.abstract || ''
          },
        },
        defaultLang,
      },
      // redirect to langs
      beforeEnter: (to, from, next) => {
        const path = ensureSlashEnding(to.path)

        let lang
        if (to.meta.frontmatter.langs.includes(to.query.lang as string))
          lang = to.query.lang
        else
          lang = to.meta.defaultLang

        next({ path: `${path}${lang}` })
      },
    }

    routes.push(newRoute)
  })
}

export function addMultiLangPages(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const maps = new Map<string, Map<string, RouteRecordRaw>>()
  routes.forEach((route) => {
    const info = getMultiLangBase(route)
    if (!info)
      return

    const [baseRoute, lang] = info

    if (!maps.has(baseRoute))
      maps.set(baseRoute, new Map<string, RouteRecordRaw>())

    if (maps.get(baseRoute).has(lang))
      throw new Error(`Duplicate route for ${baseRoute} with lang ${lang}`)
    else
      maps.get(baseRoute).set(lang, route)
  })

  addRedirectToRoutes(routes, maps)

  return routes
}

export function redirectAll(routes: RouteRecordRaw[]) {
  routes.push({
    name: 'CatchAll',
    path: '/:catchAll(.*)',
    redirect: { path: '/404' },
  })

  return routes
}
