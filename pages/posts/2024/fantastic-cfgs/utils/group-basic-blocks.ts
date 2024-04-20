import type { Instruction, Program } from './types'

export interface BasicBlock {
  instrs: Instruction[]
  label: string
  next: string[]
}

export const START_LABEL = 'start'

export interface FuncBlockMapping {
  [funcName: string]: BasicBlock[]
}

export function groupBasicBlocks(program: Program): FuncBlockMapping {
  const result: FuncBlockMapping = {}

  program.functions.forEach((func) => {
    const basicBlocks: BasicBlock[] = result[func.name] = []
    let currentBlock: BasicBlock = { label: `${func.name}.${START_LABEL}`, instrs: [], next: [] }

    func.instrs.forEach((instr, instrIndex) => {
      if ('label' in instr) {
        if (currentBlock.instrs.length > 0)
          basicBlocks.push(currentBlock)

        currentBlock.next.push(instr.label)

        currentBlock = { label: instr.label, instrs: [], next: [] }
      } else {
        if (instr.op === 'br' || instr.op === 'jmp' || instr.op === 'ret') {
          if (instr.op === 'br' || instr.op === 'jmp')
            currentBlock.next.push(instr.labels[0])

          currentBlock.instrs.push(instr)
          basicBlocks.push(currentBlock)
          // + 1 because of index, and another +1 because the label is in the next line
          const inlineLabel = `${func.name}.l${instrIndex + 2}`
          currentBlock = { label: inlineLabel, instrs: [], next: [] }
        } else {
          currentBlock.instrs.push(instr)
        }
      }
    })

    if (currentBlock.instrs.length > 0)
      basicBlocks.push(currentBlock)
  })

  return result
}
