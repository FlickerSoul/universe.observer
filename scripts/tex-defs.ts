import type { KatexOptions } from 'katex'

const lambdaCalculusTypes = {
  '\\Int': '\\texttt{Int}',
  '\\Bool': '\\texttt{Bool}',
  '\\Unit': '\\texttt{Unit}',
  '\\unit': '<>',
  '\\true': '\\texttt{true}',
  '\\false': '\\texttt{false}',
  '\\arwt': '\\rightarrow',
  '\\inj': '\\iota',
  '\\proj': '\\pi',
  '\\defsas': '\\Coloneqq',
  '\\isubs': '/',
  '\\subs': '\\mapsto',
  '\\sgleval': '\\mapsto',
  '\\muleval': '\\mapsto^*',
}

const lambdaCalculusOperations = {
  '\\app': '#1\\, #2',
  '\\stlc': '\\lambda #1: #2.\\ #3',
  '\\inl': '\\iota_1\\, #1',
  '\\inr': '\\iota_2\\, #1',
  '\\case':
    '\\texttt{case}(#1): \\inl x \\texttt{=>} #2;\\ \\inr x \\texttt{=>} #3',
  '\\succ': '\\texttt{succ}(#1)',
  '\\pred': '\\texttt{pred}(#1)',
  '\\iszero': '\\texttt{iszero}(#1)',
  '\\if': '\\texttt{if}(#1)\\, \\texttt{then}(#2)\\, \\texttt{else}(#3)',
  '\\fst': '\\pi_1\\,#1',
  '\\snd': '\\pi_2\\,#1',
  '\\lc': '\\lambda #1.\\ #2',
  '\\subi': '\\left[ #1 \\isubs #2 \\right]',
  '\\irred': '\\texttt{irred}\\left(#1\\right)',
}

export const katexOptions: KatexOptions = {
  macros: {
    ...lambdaCalculusTypes,
    ...lambdaCalculusOperations,
  },
}

const KATEX_COMPONENTS = [
  'math',
  'semantics',
  'mrow',
  'mi',
  'mo',
  'annotation',
  'msub',
  'mtext',
  'mn',
  'mtable',
  'mtr',
  'mtd',
  'mstyle',
  'big',
  'msup',
  'munder',
  'mover',
]

export function checkCustomComponent(tag: string) {
  return KATEX_COMPONENTS.includes(tag)
}
