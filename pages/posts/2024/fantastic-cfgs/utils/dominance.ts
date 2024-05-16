import {BasicBlock, BlockNode} from "./group-basic-blocks";
import {BlockDataFlowMachine, GenFunc, MergeFunc} from "./data-flow-machine";

type DominanceDataType = string

export function dominance(blocks: BasicBlock[], strict: boolean): BasicBlock[] {
  const genFunc: GenFunc<BlockNode, DominanceDataType> = (block) => {
    return [block.blockRef.label]
  }
  const mergeFunc: MergeFunc<DominanceDataType> = (...data) => {
    if (data.length === 0) return []
    const [first, ...rest] = data
    return first.filter(d => rest.every(r => r.includes(d)))
  }
  const killFunc: GenFunc<BlockNode, DominanceDataType> = (block) => {
    return []
  }

  const machine = new BlockDataFlowMachine(genFunc, killFunc, mergeFunc).loadBlockGraph(blocks)

  machine.run()

  const data = strict ? machine.dataIn : machine.dataOut

  data.forEach((data, index) => {
    const notes = (machine.graph.indexToNode.get(index)!.blockRef.notes ?? [])
    if (data.length > 0) {
      machine.graph.indexToNode.get(index)!.blockRef.notes = notes.concat(
        (strict ? 'strictly ' : '') + 'dominated by: \n' + data.join(', ')
      )
    }
  })

  return blocks
}
