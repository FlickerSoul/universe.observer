import type MarkdownIt from 'markdown-it'

export interface Options {
  wrappingTag?: string
}

export default function customCodeFence(
  md: MarkdownIt,
  { wrappingTag = 'code' }: Options = {},
) {
  md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    const token = tokens[idx]
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
    let langName = ''
    let langAttrs = ''
    let highlighted
    let i
    let arr
    let tmpAttrs
    let tmpToken

    if (info) {
      arr = info.split(/(\s+)/g)
      langName = arr[0]
      langAttrs = arr.slice(2).join('')
    }

    if (options.highlight)
      highlighted = options.highlight(token.content, langName, langAttrs) || md.utils.escapeHtml(token.content)
    else
      highlighted = md.utils.escapeHtml(token.content)

    if (highlighted.indexOf('<pre') === 0)
      return `${highlighted}\n`

    // If language exists, inject class gently, without modifying original token.
    // May be, one day we will add .deepClone() for token and simplify this part, but
    // now we prefer to keep things local.
    if (info) {
      i = token.attrIndex('class')
      tmpAttrs = token.attrs ? token.attrs.slice() : []

      if (i < 0) {
        tmpAttrs.push(['class', options.langPrefix + langName])
      } else {
        tmpAttrs[i] = tmpAttrs[i].slice()
        tmpAttrs[i][1] += ` ${options.langPrefix}${langName}`
      }

      // Fake token just to render attributes
      tmpToken = {
        attrs: tmpAttrs,
      }

      return `<pre><${wrappingTag}${slf.renderAttrs(tmpToken)}>${
         highlighted
         }</${wrappingTag}></pre>\n`
    }

    return `<pre><${wrappingTag}${slf.renderAttrs(token)}>${
       highlighted
       }</${wrappingTag}></pre>\n`
  }
}
