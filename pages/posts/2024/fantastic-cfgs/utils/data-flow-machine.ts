import {BasicBlock, blocksToPlainGraph, InstrGraph, InstrNode} from "./group-basic-blocks";

export interface Equals {
  equals: (this, other: typeof this) => boolean
}

type DType = Equals | string | number | boolean

export type GenFunc<DataType extends DType> = (block: InstrNode) => DataType[]
export type KillFunc<DataType extends DType> = (block: InstrNode, inData: DataType[], genData: DataType[]) => DataType[]
export type MergeFunc<DataType extends DType> = (...data: DataType[][]) => DataType[]

export class DataFlowMachine<DataType extends DType> {
  genFunc: GenFunc<DataType>
  killFunc: KillFunc<DataType>
  mergeFunc: MergeFunc<DataType>
  dataIn: Map<number, DataType[]>
  dataOut: Map<number, DataType[]>
  graph: InstrGraph | undefined


  constructor(genFunc: GenFunc<DataType>, killFunc: KillFunc<DataType>, mergeFunc: MergeFunc<DataType>) {
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

  loadGraph(graph: InstrGraph) {
    this.graph = graph
    return this
  }

  loadBlocks(blocks: BasicBlock[]) {
    const graph = blocksToPlainGraph(blocks)
    return this.loadGraph(graph)
  }

  run(): void {
    const graph = this.graph
    if (graph === undefined) throw new Error('Graph is undefined')

    const rootIndex = graph.root.instrRow()
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
