import type MarkdownIt from 'markdown-it'
import type { MermaidConfig } from 'mermaid'
import Mermaid from 'mermaid'

export type MermaidOptions = MermaidConfig

export default function retainMermaid(md: MarkdownIt, options: MermaidOptions = {}) {
  Mermaid.initialize({
    securityLevel: 'loose',
    ...options,
  })

  function getLangName(info: string) {
    return info.split(/\s+/g)[0]
  }

  const defaultFenceRenderer = md.renderer.rules.fence

  function customFenceRenderer(
    tokens: any[],
    idx: number,
    options: any,
    env: any,
    slf: any,
  ) {
    const token = tokens[idx]
    const info = token.info.trim()
    const langName = info ? getLangName(info) : ''

    if (!['mermaid', '{mermaid}'].includes(langName)) {
      if (defaultFenceRenderer !== undefined)
        return defaultFenceRenderer(tokens, idx, options, env, slf)

      // Missing fence renderer!
      return ''
    }

    return `<Magnifier><div class="mermaid-container"><pre class='mermaid-content'>${token.content}</pre></div></Magnifier>`
  }

  md.renderer.rules.fence = customFenceRenderer
}
