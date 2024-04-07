import type MarkdownIt from 'markdown-it'

export default function wrapMagnifier(md: MarkdownIt) {
  const defaultFenceRenderer = md.renderer.rules.image

  md.renderer.rules.image = function customImageRenderer(tokens, idx, options, env, self) {
    return `<Magnifier>${defaultFenceRenderer(tokens, idx, options, env, self)}</Magnifier>`
  }
}
