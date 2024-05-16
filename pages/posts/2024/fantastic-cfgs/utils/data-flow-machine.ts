import {
  BasicBlock,
  BlockGraph,
  BlockNode,
  blocksToBlockGraph,
  blocksToInstrGraph,
  Graph,
  GraphNode,
  InstrGraph,
  InstrNode
} from "./group-basic-blocks";

export interface Equals {
  equals: (this, other: typeof this) => boolean
}

type DType = Equals | string | number | boolean

export type GenFunc<NodeType extends GraphNode, DataType extends DType> = (block: NodeType) => DataType[]
export type KillFunc<NodeType extends GraphNode, DataType extends DType> = (block: NodeType, inData: DataType[], genData: DataType[]) => DataType[]
export type MergeFunc<DataType extends DType> = (...data: DataType[][]) => DataType[]

export class DataFlowMachine<NodeType extends GraphNode, GraphType extends Graph<NodeType>, DataType extends DType> {
  genFunc: GenFunc<NodeType, DataType>
  killFunc: KillFunc<NodeType, DataType>
  mergeFunc: MergeFunc<DataType>
  dataIn: Map<number, DataType[]>
  dataOut: Map<number, DataType[]>
  graph: GraphType | undefined


  constructor(genFunc: GenFunc<NodeType, DataType>, killFunc: KillFunc<NodeType, DataType>, mergeFunc: MergeFunc<DataType>) {
    this.genFunc = genFunc
    this.killFunc = killFunc
    this.mergeFunc = mergeFunc
    this.dataIn = new Map<number, DataType[]>()
    this.dataOut = new Map<number, DataType[]>()
  }

  init(index: number, data: DataType[]) {
    this.dataIn.set(index, data)
    return this
  }

  loadGraph(graph: GraphType) {
    this.graph = graph
    return this
  }


  run(): void {
    const graph = this.graph
    if (graph === undefined) throw new Error('Graph is undefined')

    const rootIndex = graph.root.index()
    if (rootIndex === undefined)
      throw new Error('Root index is undefined')

    const workList: number[] = [rootIndex]

    while (workList.length > 0) {
      const head = workList.shift()
      const node = graph.indexToNode.get(head)!
      const prevIndices = node.prev.map(prev => prev.index())
      const prevIn =
        prevIndices.length > 0 ?
          this.mergeFunc(
            ...prevIndices.map(index => this.dataOut.get(index)).filter(data => data !== undefined)
          ) :
          (this.dataIn.get(head) ?? [])

      this.dataIn.set(head, prevIn)

      const genned = this.genFunc(node)
      const allIn = this.union(prevIn, genned)
      const killed = this.killFunc(node, prevIn, genned)

      const out = this.filter(allIn, killed)

      this.dataOut.set(head, out)

      workList.push(...node.next.map(next => next.index()))
    }
  }

  filter(a: DataType[], b: DataType[]): DataType[] {
    return a.filter(elem => {
      for (const other of b) {
        if (typeof elem === 'object' ? elem.equals(other) : elem === other) {
          return false
        }
      }
      return true
    })
  }

  union(a: DataType[], b: DataType[]): DataType[] {
    return a.concat(b).reduce((acc, curr) => {
      for (const elem of acc) {
        if (typeof elem === 'object' ? elem.equals(curr) : elem === curr) {
          return acc
        }
      }
      acc.push(curr)
      return acc
    }, [] as DataType[])
  }
}

export class InstrDataFlowMachine<DataType extends DType> extends DataFlowMachine<InstrNode, InstrGraph, DataType> {
  loadInstrGraph(blocks: BasicBlock[]) {
    const graph = blocksToInstrGraph(blocks)
    return this.loadGraph(graph)
  }
}

export class BlockDataFlowMachine<DataType extends DType> extends DataFlowMachine<BlockNode, BlockGraph, DataType> {
  loadBlockGraph(blocks: BasicBlock[]) {
    const graph = blocksToBlockGraph(blocks)
    return this.loadGraph(graph)
  }
}
