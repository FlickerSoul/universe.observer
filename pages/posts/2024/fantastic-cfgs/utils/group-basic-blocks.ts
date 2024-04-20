import type { Instruction, Program } from './types'

export interface BasicBlock {
  instrs: Instruction[]
  label: string
}

export const START_LABEL = 'start'

export function groupBasicBlocks(program: Program): BasicBlock[] {
  const basicBlocks: BasicBlock[] = []
  let currentBlock: BasicBlock = { label: START_LABEL, instrs: [] }

  for (const func of program.functions) {
    for (const instr of func.instrs) {
      if ('label' in instr) {
        if (currentBlock.instrs.length > 0)
          basicBlocks.push(currentBlock)

        currentBlock = { label: instr.label, instrs: [] }
      } else {
        currentBlock.instrs.push(instr)
      }
    }
  }

  if (currentBlock.instrs.length > 0)
    basicBlocks.push(currentBlock)

  return basicBlocks
}
