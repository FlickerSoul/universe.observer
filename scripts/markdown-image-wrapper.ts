import type { Plugin, TransformResult } from 'vite'
import { createFilter } from 'vite'

export interface Options {
  include?: string[]
  exclude?: string[]
  matchRe?: RegExp
  converter?: (matched: RegExpMatchArray) => string
}

export type ResolvedOptions = Required<Options>

export const DEFAULT_OPTIONS: ResolvedOptions = {
  include: ['**/*.md'],
  exclude: [],
  matchRe: /!\[(.*?)\]\((.*?)\)/g,
  converter(matched) {
    return `<Magnifier>\n\n${matched[0]}\n\n</Magnifier>`
  },
}

function resolveOptions(options: Options = {}): ResolvedOptions {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  }
}

type Extractor = (code: string) => TransformResult

function getExtractor(options: ResolvedOptions): Extractor {
  return (code) => {
    const { matchRe, converter } = options
    const matches = code.matchAll(matchRe)

    for (const match of matches)
      code = code.replace(match[0], converter(match))

    return {
      code,
      map: null,
    }
  }
}

export default function MarkdownImageWrapper(
  options: Options = {},
): Plugin {
  const resolvedOptions = resolveOptions(options)
  const extractor = getExtractor(resolvedOptions)
  const filter = createFilter(resolvedOptions.include, resolvedOptions.exclude)

  return {
    name: 'markdown-image-wrapper',
    enforce: 'pre',
    transform(code, id) {
      if (!filter(id))
        return
      return extractor(code)
    },
    async handleHotUpdate(ctx) {
      if (!filter(ctx.file))
        return
      const defaultRead = ctx.read
      ctx.read = async () => {
        return extractor(await defaultRead()).code
      }
    },
  }
}
