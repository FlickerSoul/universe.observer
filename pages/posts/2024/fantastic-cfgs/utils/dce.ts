import type { Program } from './types'
import type { BasicBlock } from './group-basic-blocks'
import { groupBasicBlocks } from './group-basic-blocks'
import { funcBlocksToFunc } from './bril-txt'

type BlockIndex = number
type InstrIndex = number

interface InstrIdent {
  blockIndex: BlockIndex
  instrIndex: InstrIndex
}

interface InstrInfo {
  ident: InstrIdent
  used: boolean
  stale: boolean
}

interface FlowInformation {
  definitions: Map<string, InstrInfo[]>
  blockIn: Map<number, Map<string, InstrInfo[]>>
}

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

function eliminateRecursive(
  currentIndex: BlockIndex,
  blocks: BasicBlock[],
  blockLabelToIndex: Map<string, BlockIndex>,
  flow: FlowInformation,
) {
  const currentBlock = blocks[currentIndex]

  const lastIn = flow.blockIn.get(currentIndex)
  if (lastIn === flow.definitions) {
    // if converges, return
    return
  }

  flow.blockIn.set(currentIndex, deepCopy(flow.definitions))

  for (let instrIndex = 0; instrIndex < currentBlock.instrs.length; instrIndex++) {
    const instr = currentBlock.instrs[instrIndex]
    const instrIdent = { blockIndex: currentIndex, instrIndex }

    // mark things as used
    if ('args' in instr) {
      instr.args!.forEach((arg) => {
        if (flow.definitions.has(arg)) {
          const argInfo = flow.definitions.get(arg)

          argInfo!.forEach((info) => {
            if (!info.stale)
              info.used = true
          })
        }
      })
    }

    // mark things as stale
    if ('dest' in instr) {
      const dest = instr.dest

      if (!flow.definitions.has(dest))
        flow.definitions.set(dest, [])

      const destInfo = flow.definitions.get(dest)
      destInfo!.forEach((info) => {
        info.stale = true
      })

      destInfo!.push({ ident: instrIdent, used: false, stale: false })
    }
  }

  for (const nextLabel of currentBlock.next) {
    const nextIndex = blockLabelToIndex.get(nextLabel)
    if (nextIndex === undefined)
      continue

    eliminateRecursive(nextIndex, blocks, blockLabelToIndex, flow)
  }
}

export interface EliminationBlocksResult {
  passes: BasicBlock[][]
  final: BasicBlock[]
}

function eliminateDeadCodeFromInstructions(blocks: BasicBlock[]): EliminationBlocksResult {
  if (blocks.length === 0) {
    return {
      passes: [],
      final: [],
    }
  }

  let modified = true

  const blockLabelToIndex = new Map<string, BlockIndex>()
  blocks.forEach((block, index) => {
    blockLabelToIndex.set(block.label, index)
  })

  const passes: BasicBlock[][] = [deepCopy(blocks)]

  while (modified) {
    const info: FlowInformation = {
      definitions: new Map(),
      blockIn: new Map(),
    }

    eliminateRecursive(0, blocks, blockLabelToIndex, info)
    const deadAssignment
      = Array.from(info.definitions.values())
        .flatMap((defInfo) => {
          return defInfo.filter(info => !info.used).map(info => [info.ident.blockIndex, info.ident.instrIndex])
        })
        .reduce((acc, [blockIndex, instrIndex]) => {
          if (!acc.get(blockIndex))
            acc.set(blockIndex, [])

          acc.get(blockIndex)!.push(instrIndex)
          return acc
        }, new Map() as Map<number, InstrIndex[]>)

    const deadAssignmentArr = Array.from(deadAssignment.entries())
    modified = deadAssignmentArr.length > 0

    for (const [blockIndex, instrIndexes] of deadAssignmentArr) {
      const block = blocks[blockIndex]
      blocks[blockIndex] = {
        label: block.label,
        instrs: block.instrs.filter((_, index) => !instrIndexes.includes(index)),
        next: block.next,
      }
    }

    if (modified)
      passes.push(deepCopy(blocks))
  }

  return {
    passes,
    final: blocks,
  }
}

export interface EliminationProgramResult {
  passes: Program[]
  final: Program
}

export function eliminateDeadAssignment(prog: Program): EliminationProgramResult {
  const basicBlockMapping = groupBasicBlocks(prog)

  const eliminationResults
    = new Map(Object.entries(basicBlockMapping).map(([funcName, blocks]) => {
      return [funcName, eliminateDeadCodeFromInstructions(blocks)] as [string, EliminationBlocksResult]
    }))

  const maxPasses = Array.from(eliminationResults.values()).reduce(
    (prev, { passes }) => Math.max(prev, passes.length),
    0,
  )

  const progPasses: Program[] = []

  for (let passIndex = 0; passIndex < maxPasses; passIndex++) {
    progPasses.push({
      functions: prog.functions.map((fun) => {
        const funName = fun.name
        const eliminationResult = eliminationResults.get(funName)!
        const validPassIndex = Math.min(passIndex, eliminationResult.passes.length - 1)
        const funBlocks = eliminationResult.passes[validPassIndex]

        return funcBlocksToFunc(funName, funBlocks, fun.args, fun.type, fun.pos)
      }),
    })
  }

  return {
    passes: progPasses,
    final: {
      functions: prog.functions.map((fun) => {
        const funName = fun.name
        const eliminationResult = eliminationResults.get(funName)!
        const funBlocks = eliminationResult.final

        return funcBlocksToFunc(funName, funBlocks, fun.args, fun.type, fun.pos)
      }),
    },
  }
}
