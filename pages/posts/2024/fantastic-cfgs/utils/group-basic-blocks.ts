import type { IFunction, Instruction, Program } from './types'

export interface BasicBlock {
  instrs: Instruction[]
  label: string
  next: string[]
  naturalLoopPD?: BasicBlock[]
  notes?: string[]
}

export const START_LABEL = 'start'

export interface FuncBlockMapping {
  [funcName: string]: BasicBlock[]
}

export function groupBasicBlocksForFun(func: IFunction) {
  const basicBlocks: BasicBlock[] = []
  let currentBlock: BasicBlock = {
    label: `${func.name}.${START_LABEL}`,
    instrs: [],
    next: [],
  }

  func.instrs.forEach((instr, instrIndex) => {
    if ('label' in instr) {
      if (currentBlock.instrs.length > 0) basicBlocks.push(currentBlock)

      currentBlock.next.push(instr.label)

      currentBlock = { label: instr.label, instrs: [], next: [] }
    } else {
      if (instr.op === 'br' || instr.op === 'jmp' || instr.op === 'ret') {
        if (instr.op === 'br' || instr.op === 'jmp') {
          const labels = instr.labels as string[]

          for (const label of labels) currentBlock.next.push(label)
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

  if (currentBlock.instrs.length > 0) basicBlocks.push(currentBlock)

  return basicBlocks
}

export interface GraphNode {
  index(): number | undefined

  next: GraphNode[]
  prev: GraphNode[]
}

export interface Graph<NodeType extends GraphNode> {
  nodes: Map<number, NodeType>
  root: NodeType | undefined
  indexToLabel: Map<number, string>
  indexToNode: Map<number, NodeType>

  setRoot(root: NodeType): void

  registerIndex(node: NodeType): void

  addNode(node: NodeType): void
}

export class InstrGraph implements Graph<InstrNode> {
  nodes: Map<number, InstrNode>
  root: InstrNode | undefined = undefined
  indexToLabel: Map<number, string> = new Map()
  indexToNode: Map<number, InstrNode> = new Map()

  constructor(nodes: Map<number, InstrNode> | undefined = undefined) {
    this.nodes = nodes ?? new Map()
  }

  registerIndex(instr: InstrNode) {
    this.indexToLabel.set(instr.index(), instr.label)
    this.indexToNode.set(instr.index(), instr)
  }

  setRoot(root: InstrNode) {
    this.root = root
    this.registerIndex(root)
  }

  addNode(node: InstrNode) {
    const index = node.index()
    if (index === undefined) throw new Error('Node index is undefined')
    this.nodes.set(index, node)
    this.registerIndex(node)
  }
}

export class InstrNode implements GraphNode {
  instr: Instruction
  next: InstrNode[]
  prev: InstrNode[]
  label: string

  constructor(
    instr: Instruction,
    label: string,
    next: InstrNode[] | undefined = undefined,
    prev: InstrNode[] | undefined = undefined,
  ) {
    this.instr = instr
    this.next = next ?? []
    this.prev = prev ?? []
  }

  instrRow(): number | undefined {
    return this.instr.pos?.row
  }

  addSucc(node: InstrNode) {
    this.next.push(node)
    node.prev.push(this)
  }

  index(): number | undefined {
    return this.instrRow()
  }
}

function blockToGraph(
  block: BasicBlock,
  graph: InstrGraph,
): [InstrNode, InstrNode] {
  const startNode: InstrNode = new InstrNode(block.instrs[0], block.label)
  graph.addNode(startNode)
  let currentNode = startNode

  for (let i = 1; i < block.instrs.length; i++) {
    const nextNode: InstrNode = new InstrNode(block.instrs[i], block.label)
    currentNode.addSucc(nextNode)
    graph.addNode(nextNode)
    currentNode = nextNode
  }

  return [startNode, currentNode]
}

export function blocksToInstrGraph(blocks: BasicBlock[]): InstrGraph {
  const graph = new InstrGraph()

  if (blocks.length === 0) return graph

  const blockStartEndNodes = blocks.map(block => blockToGraph(block, graph))
  const labelToIndex = new Map(
    blocks.map((block, index) => [block.label, index] as const),
  )
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

  program.functions.forEach(func => {
    result[func.name] = groupBasicBlocksForFun(func)
  })

  return result
}

export class BlockNode implements GraphNode {
  blockRef: BasicBlock
  index: () => number
  prev: BlockNode[]
  next: BlockNode[]

  constructor(
    blockRef: BasicBlock,
    index: number,
    prev: BlockNode[] = [],
    next: BlockNode[] = [],
  ) {
    this.blockRef = blockRef
    this.index = () => index
    this.prev = prev
    this.next = next
  }
}

export class BlockGraph implements Graph<BlockNode> {
  nodes: Map<number, BlockNode>
  root: BlockNode | undefined = undefined
  indexToLabel: Map<number, string> = new Map()
  indexToNode: Map<number, BlockNode> = new Map()

  constructor(nodes: Map<number, BlockNode> | undefined = undefined) {
    this.nodes = nodes ?? new Map()
  }

  registerIndex(node: BlockNode) {
    this.indexToLabel.set(node.index(), node.blockRef.label)
    this.indexToNode.set(node.index(), node)
  }

  setRoot(root: BlockNode) {
    this.root = root
    this.registerIndex(root)
  }

  addNode(node: BlockNode) {
    this.nodes.set(node.index(), node)
    this.registerIndex(node)
  }
}

export function blocksToBlockGraph(blocks: BasicBlock[]): BlockGraph {
  const graph = new BlockGraph()
  if (blocks.length === 0) return graph

  const blockNodes = blocks.map((node, index) => new BlockNode(node, index))
  const labelToIndex = new Map(
    blocks.map((block, index) => [block.label, index] as const),
  )
  graph.setRoot(blockNodes[0])

  for (let i = 0; i < blocks.length; i++) {
    const node = blockNodes[i]
    const nextNodes = node.blockRef.next
      .map(label => labelToIndex.get(label)!)
      .map(index => blockNodes[index])
    node.next = nextNodes
    nextNodes.forEach(next => next.prev.push(node))

    graph.addNode(node)
  }

  return graph
}
