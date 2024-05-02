import { type HighlighterGeneric, getHighlighter } from 'shiki'
import brilJson from '../../scripts/bril-textmate.json?raw'
import nordJson from '../../scripts/nord.json?raw'
import rosePineDawnJson from '../../scripts/rose-pine-dawn.json?raw'
import { BrilTransformerFactory } from '../../scripts/BrilTransformer'

const bril = JSON.parse(brilJson)
const nord = JSON.parse(nordJson)
const rosePineDawn = JSON.parse(rosePineDawnJson)

const highlighter = await getHighlighter({
  themes: [nord, rosePineDawn],
  langs: ['typescript', 'c++', 'python', 'markdown', 'latex', 'swift', 'kotlin', bril],
})

export const CustomHighlighter: HighlighterGeneric<any, any> = {
  ...highlighter,
  codeToHtml(code, options) {
    return highlighter.codeToHtml(code, {
      ...options,
      mergeWhitespaces: false,
      transformers: [
        BrilTransformerFactory(bril, nord, rosePineDawn),
      ],
    })
  },
}
