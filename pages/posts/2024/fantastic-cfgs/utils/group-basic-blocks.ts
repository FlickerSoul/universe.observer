import type { Instruction, Program } from './types'

export interface BasicBlock {
  instrs: Instruction[]
  label: string
}

export const START_LABEL = 'start'

export function groupBasicBlocks(program: Program): BasicBlock[] {
  const basicBlocks: BasicBlock[] = []
  let currentBlock: BasicBlock = { label: START_LABEL, instrs: [] }

  program.functions.forEach((func, funcIndex) => {
    func.instrs.forEach((instr, instrIndex) => {
      if ('label' in instr) {
        if (currentBlock.instrs.length > 0)
          basicBlocks.push(currentBlock)

        currentBlock = { label: instr.label, instrs: [] }
      } else {
        if (instr.op === 'br' || instr.op === 'jmp' || instr.op === 'ret') {
          currentBlock.instrs.push(instr)
          basicBlocks.push(currentBlock)
          const inlineLabel = `${'\u200B'.repeat(funcIndex)}.${'\u200B'.repeat(instrIndex)}`
          currentBlock = { label: inlineLabel, instrs: [] }
        } else {
          currentBlock.instrs.push(instr)
        }
      }
    })
  })

  if (currentBlock.instrs.length > 0)
    basicBlocks.push(currentBlock)

  return basicBlocks
}
