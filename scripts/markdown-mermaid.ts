import type MarkdownIt from 'markdown-it'

export default function retainMermaid(md: MarkdownIt) {
  function getLangName(info: string) {
    return info.split(/\s+/g)[0]
  }

  const defaultFenceRenderer = md.renderer.rules.fence

  md.renderer.rules.fence = function customFenceRenderer(
    tokens,
    idx,
    options,
    env,
    slf,
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
}
