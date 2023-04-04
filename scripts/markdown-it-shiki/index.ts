import { createRequire } from 'node:module'
import type { HtmlRendererOptions, IShikiTheme, IThemeRegistration } from 'shiki'
import type MarkdownIt from 'markdown-it'
import { createSyncFn } from 'synckit'
import {
  APPENDING_POSITIONS,
  DarkModeThemes,
  ElementProcessorType,
  ExtraPosition,
  IElementIntel,
  IExtraProcessor,
  IProcessorOutput,
  Options,
  PREPENDING_POSITIONS,
  PositionHolderClasses,
} from './types'

export {
  ExtraPosition,
  IElementIntel,
  IExtraProcessor,
  IProcessorOutput,
  ElementProcessorType,
  DarkModeThemes,
  Options,
}

function getThemeName(theme: IThemeRegistration) {
  if (typeof theme === 'string')
    return theme
  return (theme as IShikiTheme).name
}

// capture highlight
const HIGHLIGHT_RE = /{([\d,-]+)}/
// capture the highlight color of the actual code block
const BACKGROUND_STYLE_RE = /^<pre[^>]*style="([^"]*)"[^>]*>/

// the classes used to distinguish between dark and light mode
export const DARK_CLASS = 'shiki-dark'
export const LIGHT_CLASS = 'shiki-light'

export function resolveOptions(options: Options) {
  const themes: IThemeRegistration[] = []
  let darkModeThemes: DarkModeThemes | undefined

  if (!options.theme) {
    themes.push('nord')
  } else if (typeof options.theme === 'string') {
    themes.push(options.theme)
  } else {
    if ('dark' in options.theme || 'light' in options.theme) {
      darkModeThemes = options.theme as DarkModeThemes
      themes.push(darkModeThemes.dark)
      themes.push(darkModeThemes.light)
    } else {
      themes.push(options.theme)
    }
  }

  return {
    ...options,
    themes,
    darkModeThemes: darkModeThemes
      ? {
          dark: getThemeName(darkModeThemes.dark),
          light: getThemeName(darkModeThemes.light),
        }
      : undefined,
    extra: options.extra || [],
    mermaidTheme: { dark: 'dark', light: 'default', ...options.mermaidTheme },
  }
}

const attrsToLines = (attrs: string): HtmlRendererOptions['lineOptions'] => {
  const result: number[] = []
  if (!attrs.trim())
    return []

  attrs
    .split(',')
    .map(v => v.split('-').map(v => parseInt(v, 10)))
    .forEach(([start, end]) => {
      if (start && end) {
        result.push(
          ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
        )
      } else {
        result.push(start)
      }
    })
  return result.map(v => ({
    line: v,
    classes: ['highlighted'],
  }))
}

const processExtra = (extra: IExtraProcessor[], attrs: string, lang: string, code: string) => {
  const result: IProcessorOutput[] = []
  if (extra === undefined)
    return result

  extra.forEach((processor) => {
    const matched = processor.attrRe ? processor.attrRe.exec(attrs) : null
    result.push({
      light: processor.light(matched, lang, code),
      dark: processor.dark === null ? null : (processor.dark || processor.light)(matched, lang, code),
      position: processor.position,
    })
  })

  return result
}

const getStyleContent = (tag: string, regex: RegExp) => {
  const match = regex.exec(tag)
  let style_content = ''
  if (match)
    style_content = match[1]
  return style_content
}

const prependStyle = (intel: IElementIntel | undefined, style: string) => {
  if (!intel)
    return

  if (!style.endsWith(';'))
    style += ';'

  if (intel.attrs.style)
    intel.attrs.style = `${style};${intel.attrs.style}`
  else
    intel.attrs.style = style
}

const appendClass = (intel: IElementIntel | undefined, className: string) => {
  if (!intel)
    return

  if (intel.attrs.class)
    intel.attrs.class += ` ${className}`
  else
    intel.attrs.class = className
}

export const h: ElementProcessorType = (intel) => {
  if (!intel)
    return ''

  const headPartial = `<${intel.tag}${Object.entries(intel.attrs).reduce((prev, now) => {
      return `${prev} ${now[0]}="${now[1]}"`
    }, '')}`

  if (intel.content) {
    if (typeof intel.content === 'string')
      return `${headPartial}>${intel.content}</${intel.tag}>`
    else if (Array.isArray(intel.content))
      return `${headPartial}>${intel.content.reduce((prev, now) => prev + h(now), '')}</${intel.tag}>`
    else
      return `${headPartial}>${h(intel.content)}</${intel.tag}>`
  } else { return `${headPartial} />` }
}

const SHIKI_EXTRA_CONTAINER_CLASS = 'shiki-extra-container'

function extraPositionHolderFactory(contentOnPosition: string[]) {
  return (i: ExtraPosition) => {
    const content = contentOnPosition[i]
    const posClass = PositionHolderClasses[i]
    return `<div class="${posClass} ${SHIKI_EXTRA_CONTAINER_CLASS}">${content}</div>`
  }
}

const wrapFinalContainer = (
  light: string,
  dark: string | undefined = undefined,
  processedExtra: IProcessorOutput[] | undefined = undefined) => {
  const extraContentsOnPosition: string[] = Object.keys(ExtraPosition).map(() => '')

  dark = dark || ''
  processedExtra = processedExtra || []

  const light_style_content = getStyleContent(light, BACKGROUND_STYLE_RE)
  const dark_style_content = getStyleContent(dark, BACKGROUND_STYLE_RE)

  processedExtra.forEach((extra) => {
    if (extra.dark !== null) {
      // if extra dark is not null,
      // then the element is not universal
      // add theme specific classes to both light and dark mode
      appendClass(extra.light, LIGHT_CLASS)
      prependStyle(extra.light, light_style_content)
      appendClass(extra.dark, DARK_CLASS)
      prependStyle(extra.dark, dark_style_content)
    } else {
      // if extra dark is null, then the element is universal
      // don't add theme specific classes, and set dark to undefined
      extra.dark = undefined
    }

    const lightExtra = h(extra.light)
    const darkExtra = h(extra.dark)

    extraContentsOnPosition[extra.position] += lightExtra
    extraContentsOnPosition[extra.position] += darkExtra
  })

  const extraHolderMapper = extraPositionHolderFactory(extraContentsOnPosition)
  const before = PREPENDING_POSITIONS.map(extraHolderMapper).reduce((prev, exc) => prev + exc, '')
  const after = APPENDING_POSITIONS.map(extraHolderMapper).reduce((prev, exc) => prev + exc, '')

  return `<div class="shiki-container" style="position: relative;">${before}${light}${dark}${after}</div>`
}

const isMermaid = (lang: string): boolean => lang === 'mermaid'

const MarkdownItShiki: MarkdownIt.PluginWithOptions<Options> = (markdownit, options = {}) => {
  const _highlighter = options.highlighter

  const {
    langs,
    themes,
    darkModeThemes,
    highlightLines,
    extra,
    mermaidTheme,
  } = resolveOptions(options)

  let syncRun: any
  if (!_highlighter) {
    const require = createRequire(import.meta.url)
    syncRun = createSyncFn(require.resolve('./worker.ts'))
    syncRun('getHighlighter', { langs, themes })
  }

  const transformMermaid = (code: string, theme?: string): string => {
    return `<pre class="mermaid ${theme === null ? '' : theme === darkModeThemes.dark ? DARK_CLASS : LIGHT_CLASS}">
%%{init: {'theme':'${(theme !== null && theme === darkModeThemes.dark) ? mermaidTheme.dark : mermaidTheme.light}'}}%%
${code}
</pre>`
  }

  const highlightCode
    = (code: string, lang: string, theme?: string, lineOptions?: HtmlRendererOptions['lineOptions']): string => {
      if (isMermaid(lang))
        return transformMermaid(code, theme)

      if (_highlighter)
        return _highlighter.codeToHtml(code, { lang: lang || 'text', theme, lineOptions })

      return syncRun('codeToHtml', {
        code,
        theme,
        lang: lang || 'text',
        lineOptions,
      })
    }

  markdownit.options.highlight = (code, lang, attrs) => {
    // parse highlight lines
    let lineOptions
    if (highlightLines) {
      const match = HIGHLIGHT_RE.exec(attrs)
      if (match)
        lineOptions = attrsToLines(match[1])
    }

    // parse extra
    const processedExtra = processExtra(extra, attrs, lang, code)

    // synthesize final output
    if (darkModeThemes) {
      const dark = highlightCode(code, lang, darkModeThemes.dark, lineOptions)
        .replace('<pre class="shiki', `<pre class="shiki ${DARK_CLASS}`)
      const light = highlightCode(code, lang || 'text', darkModeThemes.light, lineOptions)
        .replace('<pre class="shiki', `<pre class="shiki ${LIGHT_CLASS}`)
      return wrapFinalContainer(light, dark, processedExtra)
    } else {
      return wrapFinalContainer(
        highlightCode(
          code,
          lang || 'text',
          undefined,
          lineOptions,
        ),
        undefined,
        processedExtra,
      )
    }
  }
}

export default MarkdownItShiki
