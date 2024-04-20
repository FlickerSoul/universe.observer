import type { Program } from './types'
import type { BasicBlock } from './group-basic-blocks'
import { brilInstructionToText } from './bril-txt'

export function loadBril(content: string | any): Program {
  if (typeof content === 'string')
    return JSON.parse(content)
  else
    return content as Program
}

interface Arrow {
  from: string
  to: string
}

export function synthesizeSimpleMermaid(basicBlocks: BasicBlock[]): string {
  const mermaidStart = `stateDiagram-v2
  direction TB
  `

  const globalArrows: Arrow[] = []

  basicBlocks.forEach((block, blockIndex) => {
    if (block.instrs.length > 0) {
      const lastInstr = block.instrs[block.instrs.length - 1]
      if (lastInstr['op'] === 'br') {
        globalArrows.push({ from: block.label, to: lastInstr['labels'][0] })
        globalArrows.push({ from: block.label, to: lastInstr['labels'][1] })
      } else if (lastInstr['op'] === 'jmp') {
        globalArrows.push({ from: block.label, to: lastInstr['labels'][0] })
      } else {
        if (blockIndex < basicBlocks.length - 1)
          globalArrows.push({ from: block.label, to: basicBlocks[blockIndex + 1].label })
      }
    }
  })

  const globalArrowDef = globalArrows
    .map(({
      from,
      to,
    }) => `${from} --> ${to}`)
    .join('\n')

  return `${mermaidStart}\n${globalArrowDef}`
}

export function synthesizeMermaid(basicBlocks: BasicBlock[], arrowStyle: 'block' | 'instr' = 'block'): string {
  const mermaidStart = `stateDiagram-v2
  direction TB
  `
  const globalArrows: Arrow[] = []

  const stateDef = basicBlocks.map((block, blockIndex) => {
    const head = `state ${block.label} {`
    const tail = '}'

    const body = block.instrs
      .map((instr, index) => {
        const stateLabel = `${block.label}.${index}`
        return `state "${brilInstructionToText(instr)}" as ${stateLabel}`
      })
      .join('\n')

    const innerArrows = block.instrs.reduce((acc, instr, index) => {
      if (index === 0)
        return acc
      return `${acc}\n${block.label}.${index - 1} --> ${block.label}.${index}`
    }, '')

    if (block.instrs.length > 0) {
      const instrIndex = block.instrs.length - 1
      const lastInstr = block.instrs[instrIndex]
      const instrLabel = `${block.label}.${instrIndex}`
      const fromLabel = arrowStyle === 'block' ? block.label : instrLabel

      if (lastInstr['op'] === 'br') {
        globalArrows.push({ from: fromLabel, to: lastInstr['labels'][0] })
        globalArrows.push({ from: fromLabel, to: lastInstr['labels'][1] })
      } else if (lastInstr['op'] === 'jmp') {
        globalArrows.push({ from: fromLabel, to: lastInstr['labels'][0] })
      } else {
        if (blockIndex < basicBlocks.length - 1)
          globalArrows.push({ from: fromLabel, to: basicBlocks[blockIndex + 1].label })
      }
    }

    return `${head}\n${body}\n${innerArrows}\n${tail}\n`
  }).join('\n')

  const globalArrowDef = globalArrows
    .map(({
      from,
      to,
    }) => `${from} --> ${to}`)
    .join('\n')

  return `${mermaidStart}\n${stateDef}\n${globalArrowDef}`
}
