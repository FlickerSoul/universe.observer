import {addClassToHast, HighlighterGeneric, ShikiTransformer, type ThemedToken} from "shiki";
import {execSync} from "node:child_process";
import {type RDResult, reachingDefinition} from "../../pages/posts/2024/fantastic-cfgs/utils/rd";
import {loadBril} from "../../pages/posts/2024/fantastic-cfgs/utils/tools";
import {
  addIdToHast,
  BASIC_POPPER_PROPERTIES,
  calculateOffset,
  DEST_VARIABLE_SCOPE,
  generateFlickerCallbackEffect,
  generateId,
  VARIABLE_SCOPE
} from "./utils";
import type {Element, Properties, Text} from "hast";


declare module 'shiki' {
  interface ShikiTransformerContextMeta {
    transformRd?: string
    brilTokenExplanations?: ThemedToken[][]
    codeLines?: string[]
    rdInfo?: RDResult
  }
}

export function reachingDefinitionTransformer(highlighter: HighlighterGeneric<string, string>): ShikiTransformer {
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

      const cmd = execSync('bril2json -p', {input: code})
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
        const content = token.content.trim()

        addClassToHast(hast, isVariable ? 'bril-variable' : isDestVariable ? 'bril-dest-variable' : '')

        if (isDestVariable) {
          const id = generateId(this.options.lang, this.meta.transformRd, row, content)
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
                                .flatMap((line, index) => {
                                  const targetId = generateId(this.options.lang, this.meta.transformRd, line, content)
                                  const separator = index === reachingDefLines.size - 1 ? '' : ', '
                                  return [
                                    {
                                      type: 'element',
                                      tagName: 'a',
                                      properties: {
                                        '@click': generateFlickerCallbackEffect(targetId),
                                        'class': ['cursor-pointer'],
                                      },
                                      children: [
                                        <Text>{
                                          type: 'text',
                                          value: `${line}`,
                                        },
                                      ],
                                    },
                                    {
                                      type: 'element',
                                      tagName: 'span',
                                      children: [
                                        {
                                          type: 'text',
                                          value: separator,
                                        },
                                      ],
                                    },
                                  ]
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
