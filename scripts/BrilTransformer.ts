import { execSync } from 'node:child_process'
import type { ShikiTransformer, ThemedToken } from 'shiki'
import { addClassToHast, getHighlighter } from 'shiki'
import type { Element, Properties, Text } from 'hast'
import type { RDResult } from '../pages/posts/2024/fantastic-cfgs/utils/rd'
import { reachingDefinition } from '../pages/posts/2024/fantastic-cfgs/utils/rd'
import { loadBril } from '../pages/posts/2024/fantastic-cfgs/utils/tools'

declare module 'shiki' {
  interface ShikiTransformerContextMeta {
    transformRd?: string
    brilTokenExplanations?: ThemedToken[][]
    codeLines?: string[]
    rdInfo?: RDResult
  }
}

function calculateOffset(row: number, col: number, code: string[]) {
  const index = row - 2
  if (index < 0)
    return col

  return code.reduce((acc, line, idx) => {
    if (idx <= index)
      return acc + line.length + 1
    return acc
  }, 0) + col
}

const VARIABLE_SCOPE = 'meta.variable.bril'
const DEST_VARIABLE_SCOPE = 'meta.variable.dest.bril'
const BRIL_FLOATING_VUE_THEME = 'bril'
const BASIC_POPPER_PROPERTIES = {
  class: 'bril-hover',
  theme: BRIL_FLOATING_VUE_THEME,
  popperClass: 'shiki bril-floating',
}

function addIdToHast(hast: Element, id: string) {
  if (hast.properties === undefined)
    hast.properties = {}

  hast.properties.id = id
  return hast
}

function generateId(lang: string, prefix: string, row: number) {
  return `${lang}-${prefix}-${row}`
}

function generateClickCallback(id: string) {
  return `flicker('${id}')`
}

export async function BrilTransformerFactory(bril: any, nord: any, rose: any): Promise<ShikiTransformer> {
  const highlighter = await getHighlighter(
    {
      themes: [nord, rose],
      langs: [bril],
    },
  )

  return {
    name: 'bril:rd',
    preprocess(this, code) {
      const match = this.options.meta.__raw.match(/transform-rd=(\S+)/)

      if (this.options.lang !== 'bril' || !match)
        return

      this.meta.transformRd = match ? match[1] : undefined

      this.meta.brilTokenExplanations = highlighter.codeToTokensBase(code, {
        lang: 'bril',
        theme: 'nord',
        includeExplanation: true,
      })
      this.meta.codeLines = code.split('\n')

      const cmd = execSync('bril2json -p', { input: code })
      const json = cmd.toString()

      this.meta.rdInfo = reachingDefinition(loadBril(JSON.parse(json)))

      this.options.mergeWhitespaces = false
    },
    span(this, hast, row, col) {
      if (this.meta.transformRd === undefined)
        return

      const tokens = this.meta.brilTokenExplanations
      const code = this.meta.codeLines
      if (!tokens || !code)
        return

      const offset = calculateOffset(row, col, code)
      const token = tokens[row - 1].find(t => t.offset === offset)

      const explanation = token.explanation
      if (explanation && explanation.length > 0) {
        const firstExplanation = explanation[0]
        const scopes = firstExplanation.scopes
        const isVariable = scopes.filter(s => s.scopeName === VARIABLE_SCOPE).length > 0
        const isDestVariable = scopes.filter(s => s.scopeName === DEST_VARIABLE_SCOPE).length > 0

        addClassToHast(hast, isVariable ? 'bril-variable' : isDestVariable ? 'bril-dest-variable' : '')

        if (isDestVariable) {
          const id = generateId(this.options.lang, this.meta.transformRd, row)
          return addIdToHast(hast, id)
        } else if (isVariable) {
          // note: token col = bril json col - 1

          const variableName = token.content.trim()
          let reachingDefLines: Set<number> | undefined

          for (const rdInfo of this.meta.rdInfo.values()) {
            if (rdInfo.get(row) === undefined)
              continue
            reachingDefLines = rdInfo.get(row)?.get(variableName)
          }

          if (reachingDefLines !== undefined) {
            return <Element>{
              type: 'element',
              tagName: 'v-menu',
              properties: <Properties>{
                ...BASIC_POPPER_PROPERTIES,
              },
              children: [
                hast,
                <Element>{
                  type: 'element',
                  tagName: 'template',
                  properties: {
                    'v-slot:popper': '{}',
                  },
                  content: {
                    type: 'root',
                    children: [
                      <Element>{
                        type: 'element',
                        tagName: 'client-only',
                        children: [
                          <Element>{
                            type: 'element',
                            tagName: 'div',
                            children: [
                              <Element>{
                                type: 'element',
                                tagName: 'span',
                                children: [
                                  {
                                    type: 'text',
                                    value: 'Defined at: ',
                                  },
                                ],
                              },
                              ...Array.from(reachingDefLines)
                                .sort((a, b) => a - b)
                                .map((line, index) => {
                                  const targetId = generateId(this.options.lang, this.meta.transformRd, line)
                                  const separator = index === reachingDefLines.size - 1 ? '' : ', '
                                  return {
                                    type: 'element',
                                    tagName: 'a',
                                    properties: {
                                      '@click': generateClickCallback(targetId),
                                      'class': ['cursor-pointer'],
                                    },
                                    children: [
                                      <Text>{
                                        type: 'text',
                                        value: `${line}${separator}`,
                                      },
                                    ],
                                  }
                                }),
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  children: [],
                },
              ],
            }
          }
        }
      }

      return hast
    },
    postprocess(this) {
      this.meta.brilTokenExplanations = undefined
      this.meta.codeLines = undefined
    },
  }
}
