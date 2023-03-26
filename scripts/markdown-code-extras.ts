import { ExtraPosition } from '@uniob/markdown-it-shiki'
import type { IExtraProcessor } from '@uniob/markdown-it-shiki'

export const CopyActionButton: IExtraProcessor = {
  position: ExtraPosition.f_top_right,
  light: () => {
    return {
      tag: 'div',
      attrs: {
        style: [
          'right: 12px',
          'top: 12px',
          'background-color: transparent',
        ].join(';'),
        class: 'shiki-float-hover-visible',
      },
      content: {
        tag: 'CodeCopyButton',
        attrs: {},
      },
    }
  },
  dark: null,
}

export const LangIndicator: IExtraProcessor = {
  position: ExtraPosition.f_top_right,
  light: (matched, lang) => {
    return {
      tag: 'div',
      attrs: {
        style: [
          'right: 18px',
          'top: 6px',
          'background-color: transparent',
        ].join(';'),
        class: 'shiki-float-hover-hidden',
      },
      content: {
        tag: 'span',
        attrs: {
          class: 'font-mono',
          style: 'font-size: 0.6em;',
        },
        content: lang,
      },
    }
  },
  dark: null,
}
