import type MarkdownIt from 'markdown-it'

function parseFileName(info: string): string | null {
  const matched = /filename="(?<filename>\S+)"/g.exec(info)
  return matched && matched.groups.filename
}

export function customFenceWrapper(md: MarkdownIt) {
  const defaultFenceRenderer = md.renderer.rules.fence

  md.renderer.rules.fence = function customFenceRenderer(
    tokens,
    idx,
    options,
    env,
    slf,
  ) {
    const lang = tokens[idx].info.split(/\s/g)[0]
    const langSpan = `<span class="font-mono">${lang}</span>`
    const fileName = parseFileName(tokens[idx].info)
    const fileNameSpan = fileName
      ? `<span class="font-mono">${fileName}</span>`
      : undefined

    const containers = `<div class="shiki-extra-before flex gap-3 items-center">
    ${fileNameSpan === undefined ? langSpan : fileNameSpan}
    <div style="flex-grow: 1;" />
    ${fileNameSpan === undefined ? '' : langSpan}
    <CodeCopyButton/>
    </div>`

    const rendered = defaultFenceRenderer(tokens, idx, options, env, slf)
    const matchedPreStyles = /<pre.*? style="(?<styleContent>[^"]*?)"/g.exec(
      rendered,
    )

    return `<div class="code-container" style="${matchedPreStyles.groups.styleContent}">
    ${containers}
    <div class="code-container-wrapper">
    ${rendered}
    </div>
    </div>`
  }
}

export function retainMermaid(md: MarkdownIt) {
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

    return `<MermaidRenderer><pre>${token.content}</pre></MermaidRenderer>`
  }
}
