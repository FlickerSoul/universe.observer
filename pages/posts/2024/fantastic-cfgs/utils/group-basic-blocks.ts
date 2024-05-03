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

export class InstrGraph {
  nodes: Map<number, InstrNode>
  root: InstrNode | undefined = undefined

  constructor(nodes: Map<number, InstrNode> | undefined = undefined) {
    this.nodes = nodes ?? new Map()
  }

  setRoot(root: InstrNode) {
    this.root = root
  }

  addNode(node: InstrNode) {
    const index = node.instrRow()
    if (index === undefined)
      throw new Error('Node index is undefined')
    this.nodes.set(index, node)
  }
}

export class InstrNode {
  instr: Instruction
  next: InstrNode[]
  prev: InstrNode[]

  constructor(instr: Instruction, next: InstrNode[] | undefined = undefined, prev: InstrNode[] | undefined = undefined) {
    this.instr = instr
    this.next = next ?? []
    this.prev = prev ?? []
  }

  instrRow() {
    return this.instr.pos?.row
  }

  addSucc(node: InstrNode) {
    this.next.push(node)
    node.prev.push(this)
  }
}

function blockToGraph(block: BasicBlock, graph: InstrGraph): [InstrNode, InstrNode] {
  const startNode: InstrNode = new InstrNode(block.instrs[0])
  graph.addNode(startNode)
  let currentNode = startNode

  for (let i = 1; i < block.instrs.length; i++) {
    const nextNode: InstrNode = new InstrNode(block.instrs[i])
    currentNode.addSucc(nextNode)
    graph.addNode(nextNode)
    currentNode = nextNode
  }

  return [startNode, currentNode]
}

export function blocksToPlainGraph(blocks: BasicBlock[]): InstrGraph {
  const graph = new InstrGraph()

  if (blocks.length === 0)
    return graph

  const blockStartEndNodes = blocks.map(block => blockToGraph(block, graph))
  const labelToIndex = new Map(blocks.map((block, index) => [block.label, index] as const))
  graph.setRoot(blockStartEndNodes[0][0])

  blocks.forEach((block, index) => {
    for (const nextLabel of block.next) {
      const nextIndex = labelToIndex.get(nextLabel)

      if (nextIndex === undefined)
        throw new Error(`Label ${nextLabel} not found`)

      const nextStart = blockStartEndNodes[nextIndex][0]
      const currentEnd = blockStartEndNodes[index][1]

      currentEnd.addSucc(nextStart)
    }
  })

  return graph
}

export function groupBasicBlocks(program: Program): FuncBlockMapping {
  const result: FuncBlockMapping = {}

  program.functions.forEach((func) => {
    result[func.name] = groupBasicBlocksForFun(func)
  })

  return result
}
