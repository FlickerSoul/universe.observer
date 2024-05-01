import type { ShikiTransformer, ThemedToken } from 'shiki'
import { addClassToHast, getHighlighter } from 'shiki'
import type { Element, Properties, RootContent } from 'hast'

declare module 'shiki' {
  interface ShikiTransformerContextMeta {
    transformLvn?: boolean
    brilTokenExplanations?: ThemedToken[][]
    codeLines?: string[]
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

export async function BrilTransformerFactory(bril: any, nord: any, rose: any): Promise<ShikiTransformer> {
  const highlighter = await getHighlighter(
    {
      themes: [nord, rose],
      langs: [bril],
    },
  )

  return {
    name: 'bril:lvn',
    preprocess(this, code) {
      if (this.options.lang !== 'bril' || !this.options.meta.__raw.includes('transform-lvn')) {
        this.meta.transformLvn = false
        return
      }

      this.meta.brilTokenExplanations = highlighter.codeToTokensBase(code, {
        lang: 'bril',
        theme: 'nord',
        includeExplanation: true,
      })
      this.meta.codeLines = code.split('\n')
      this.options.mergeWhitespaces = false
    },
    span(this, hast, row, col) {
      if (!this.meta.transformLvn)
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

        if (isVariable || isDestVariable) {
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
                    <RootContent>{
                      type: 'text',
                      value: 'variable!',
                    },
                  ],
                },
                children: [],
              },
            ],
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
