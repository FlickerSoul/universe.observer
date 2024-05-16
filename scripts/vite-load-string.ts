import type { Plugin } from 'vite'
import { createFilter } from 'vite'
import { dataToEsm } from '@rollup/pluginutils'

export type MinifyFactory = (content: string) => Promise<string> | string

interface Options {
  include: string[]
  minify: boolean | MinifyFactory
}

export type UserOptions = Partial<Options>

function defaultMinify(content: string): string {
  return content
}

function resolveConfig(options: UserOptions): Options {
  return {
    ...options,
    include: ['**/*.wgsl'],
    minify: true,
  }
}

export default function (userOptions: UserOptions = {}): Plugin {
  const options = resolveConfig(userOptions)
  const minify = options.minify === true ? defaultMinify : options.minify
  const filter = createFilter(options.include)

  return {
    name: 'vite-plugin-load-string',
    async transform(source, id) {
      if (!filter(id)) return

      return {
        code: dataToEsm(minify ? await minify(source) : source),
        map: null,
      }
    },
  }
}
