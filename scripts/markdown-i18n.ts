/*
  Parse i18n block and add language tokens to the paragraphs
  grammar: @lang@ paragraph content
*/
import type MarkdownIt from 'markdown-it'
import type StateBlock from 'markdown-it/lib/rules_block/state_block'
import { SupportedLangs } from './lang'

export const I18N_LANG_ATTR = 'i18n-lang'
export const I18N_LANG_HIDDEN_CLASS = 'hidden-lang'

export interface MdI18nOptions {
}

const LANG_REGEX = /[a-z]+-?[a-z]+/

export default function (md: MarkdownIt, options: MdI18nOptions = undefined) {
  function parseI18nParagraph(state: StateBlock, startLine: number/* , endLine */) {
    let terminate
    let i
    let l
    let token
    const oldParentType = state.parentType
    let nextLine = startLine + 1
    const terminatorRules = state.md.block.ruler.getRules('paragraph')
    const endLine = state.lineMax
    const beginning = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]
    let lang: undefined | string

    // if the first character is @, start parsing
    if (state.src.at(beginning) === '@') {
      const start_pos = beginning + 1
      let found_closing = false
      let end_pos = start_pos
      // find the next @ symbol
      for (;end_pos < max && !found_closing; end_pos++) {
        if (state.src.at(end_pos) === '@')
          found_closing = true
      }

      // if we found a closing @ symbol, check if it's a language
      if (found_closing) {
        const candidate = state.src.slice(start_pos, end_pos - 1).trim()

        // check if it's a language
        if (LANG_REGEX.test(candidate)) {
          // check if the language is supported
          if (!(candidate in SupportedLangs))
            throw new Error(`Language ${candidate} is not supported`)
          // check if the language is in frontmatter
          if (state.env?.frontmatter?.langs && !state.env.frontmatter.langs.includes(candidate))
            throw new Error(`Language ${candidate} is not in frontmatter.langs`)
          if (state.env?.frontmatter?.lang && state.env.frontmatter.lang !== candidate)
            throw new Error(`Language ${candidate} does not match frontmatter.lang`)
          lang = candidate
        }
      }
    }

    state.parentType = 'paragraph'

    // jump line-by-line until empty one or EOF
    for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
      // this would be a code block normally, but after paragraph
      // it's considered a lazy continuation regardless of what's there
      if (state.sCount[nextLine] - state.blkIndent > 3)
        continue

      // quirk for blockquotes, this line should already be checked by that rule
      if (state.sCount[nextLine] < 0)
        continue

      // Some tags can terminate paragraph without empty line.
      terminate = false
      for (i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, nextLine, endLine, true)) {
          terminate = true
          break
        }
      }
      if (terminate)
        break
    }

    let content = state
      .getLines(startLine, nextLine, state.blkIndent, false)
      .trim()

    state.line = nextLine

    token = state.push('paragraph_open', 'p', 1)
    token.map = [startLine, state.line]
    token.attrs = token.attrs || []

    // the language is not undefined then add it to the paragraph
    if (lang !== undefined) {
      token.attrs.push([I18N_LANG_ATTR, lang])
      content = content.replace(`@${lang}@`, '')
    }

    token = state.push('inline', '', 0)
    token.content = content
    token.map = [startLine, state.line]
    token.children = []

    token = state.push('paragraph_close', 'p', -1)

    state.parentType = oldParentType

    return true
  }

  md.block.ruler.at(
    'paragraph',
    parseI18nParagraph,
  )
}
