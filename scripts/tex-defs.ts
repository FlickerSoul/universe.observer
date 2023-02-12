import type { KatexOptions } from 'katex'

const lambdaCalculusTypes = {
  '\\Int': '\\texttt{Int}',
  '\\Bool': '\\texttt{Bool}',
  '\\Unit': '\\texttt{Unit}',
  '\\unit': '<>',
  '\\true': '\\texttt{true}',
  '\\false': '\\texttt{false}',
}

const lambdaCalculusOperations = {
  '\\app': '#1\\, #2',
  '\\stlc': '\\lambda #1: #2. #3',
}

export const katexOptions: KatexOptions = {
  macros: {
    ...lambdaCalculusTypes,
    ...lambdaCalculusOperations,
  },
}
