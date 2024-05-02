import type { IFunction, Instruction, Program } from './types'

export interface BasicBlock {
  instrs: Instruction[]
  label: string
  next: string[]
}

export const START_LABEL = 'start'

export interface FuncBlockMapping {
  [funcName: string]: BasicBlock[]
}

export function groupBasicBlocksForFun(func: IFunction) {
  const basicBlocks: BasicBlock[] = []
  let currentBlock: BasicBlock = { label: `${func.name}.${START_LABEL}`, instrs: [], next: [] }

  func.instrs.forEach((instr, instrIndex) => {
    if ('label' in instr) {
      if (currentBlock.instrs.length > 0)
        basicBlocks.push(currentBlock)

      currentBlock.next.push(instr.label)

      currentBlock = { label: instr.label, instrs: [], next: [] }
    } else {
      if (instr.op === 'br' || instr.op === 'jmp' || instr.op === 'ret') {
        if (instr.op === 'br' || instr.op === 'jmp') {
          const labels = instr.labels as string[]

          for (const label of labels)
            currentBlock.next.push(label)
        }

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

  return basicBlocks
}

export function groupBasicBlocks(program: Program): FuncBlockMapping {
  const result: FuncBlockMapping = {}

  program.functions.forEach((func) => {
    result[func.name] = groupBasicBlocksForFun(func)
  })

  return result
}
