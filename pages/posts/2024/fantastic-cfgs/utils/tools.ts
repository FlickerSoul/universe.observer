import type { Program } from './types'
import type { BasicBlock, FuncBlockMapping } from './group-basic-blocks'
import { brilInstructionToText } from './bril-txt'

export function loadBril(content: string | any): Program {
  if (typeof content === 'string') return JSON.parse(content)
  else return content as Program
}

interface Arrow {
  from: string
  to: string
  type?: 'dotted' | 'solid'
}

function synArrows(blocks: BasicBlock[]): Arrow[] {
  const funcArrows: Arrow[] = []

  blocks.forEach(block => {
    for (const next of block.next) {
      const arrow = {
        from: block.label,
        to: next,
      }
      funcArrows.push(arrow)
    }
  })

  return funcArrows
}

function arrowsToDef(arrows: Arrow[]): string {
  return arrows
    .map(({ from, to, type }) => {
      if (type === 'dotted') return `${from} --> ${to}`
      else return `${from} --> ${to}`
    })
    .join('\n')
}

export function synthesizeSimpleMermaid(
  blockMapping: FuncBlockMapping,
): string {
  const mermaidStart = `stateDiagram-v2
  direction TB
  `

  const body = Object.entries(blockMapping)
    .map(([funcName, basicBlocks]) => {
      const funcHead = `state ${funcName} {`
      const funcTail = '}'

      const funcArrows: Arrow[] = synArrows(basicBlocks)

      const notes = basicBlocks
        .map(block => {
          let stateNote: string = ''
          if (block.notes) {
            stateNote = '\n'
            stateNote += `note right of ${block.label}\n`
            stateNote += block.notes.join('\n')
            stateNote += '\nend note'
          }
          return stateNote
        })
        .join('\n')

      let funcArrowDef: string
      if (funcArrows.length === 0) funcArrowDef = basicBlocks[0].label
      else funcArrowDef = arrowsToDef(funcArrows)

      return `${funcHead}\n${funcArrowDef}\n${notes}\n${funcTail}`
    })
    .join('\n')

  return `${mermaidStart}\n${body}`
}

export function synthesizeMermaid(blockMapping: FuncBlockMapping): string {
  const mermaidStart = `stateDiagram-v2
  direction TB
  `
  const funcDef = Object.entries(blockMapping)
    .map(([funcName, basicBlocks]) => {
      const funcHead = `state func_${funcName} {`
      const funcTail = '}'

      const stateDef = basicBlocks
        .map(block => {
          const head = `state ${block.label} {`
          const tail = '}'

          const body = block.instrs
            .map((instr, instrIndex) => {
              const stateLabel = `${block.label}.${instrIndex}`
              return `state "${brilInstructionToText(instr)}" as ${stateLabel}`
            })
            .join('\n')

          const innerArrows = block.instrs.reduce((acc, instr, index) => {
            if (index === 0) return acc
            return `${acc}\n${block.label}.${index - 1} --> ${block.label}.${index}`
          }, '')

          return `${head}\n${body}\n${innerArrows}\n${tail}\n`
        })
        .join('\n')

      const funcArrowDef = arrowsToDef(synArrows(basicBlocks))

      return `${funcHead}\n${stateDef}\n${funcArrowDef}\n${funcTail}`
    })
    .join('\n')

  return `${mermaidStart}\n${funcDef}`
}
