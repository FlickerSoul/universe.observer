import type {Program} from './types'
import {groupBasicBlocksForFun} from './group-basic-blocks'
import {DataFlowMachine, Equals, GenFunc, KillFunc, MergeFunc} from "./data-flow-machine";

type FuncName = string
type VarName = string
type LineNum = number
type RDLine = Map<VarName, Set<LineNum>> // variable, defined at line numbers
type FuncRD = Map<LineNum, RDLine> // at the line, the reaching definitions
export type RDResult = Map<FuncName, FuncRD> // function name, reaching definitions for the function

class Node<T> {
  data: T
  next: Node<T> | undefined
  prev: Node<T> | undefined

  constructor(data: T, next: Node<T> | undefined, prev: Node<T> | undefined) {
    this.data = data
    this.next = next
    this.prev = prev

    if (next)
      next.prev = this

    if (prev)
      prev.next = this
  }
}

class Deque<T> {
  private start: Node<T> | undefined = undefined
  private end: Node<T> | undefined = undefined
  private size: number = 0

  pushBack(data: T) {
    const node = new Node<T>(data, undefined, this.end)
    this.end = node
    if (this.start === undefined)
      this.start = node
    this.size++
  }

  popFront(): T | undefined {
    if (this.start === undefined)
      return undefined

    const data = this.start.data
    this.start = this.start.next
    if (this.start === undefined)
      this.end = undefined
    else
      this.start.prev = undefined
    this.size--
    return data
  }

  isEmpty(): boolean {
    return this.size === 0
  }
}

function mapEqual<K, V>(a: Map<K, Set<V>>, b: Map<K, Set<V>>): boolean {
  if (a.size !== b.size)
    return false

  for (const [key, value] of a) {
    if (!b.has(key) || setEqual(b.get(key), value))
      return false
  }

  return true
}

function setEqual<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size)
    return false

  for (const elem of a) {
    if (!b.has(elem))
      return false
  }

  return true
}

class RDData implements Equals {
  variable: string
  index: number

  constructor(variable: string, index: number) {
    this.variable = variable
    this.index = index
  }

  equals(other: RDData): boolean {
    return this.variable === other.variable && this.index === other.index
  }
}

export function rdWithMachine(prog: Program): RDResult {
  return new Map(
    prog.functions.map((func) => {
      const blocks = groupBasicBlocksForFun(func)
      const genFunc: GenFunc<RDData> = (node) => {
        if ('dest' in node.instr)
          return [new RDData(node.instr.dest, node.instrRow())]
        return []
      }
      const mergeFunc: MergeFunc<RDData> = (...data) => {
        return data.flat()
      }
      const killFunc: KillFunc<RDData> = (node, inData, _) => {
        if ('dest' in node.instr) {
          // kill those that's not defined in the current node
          const dest = node.instr.dest
          return inData.filter((rd) => (rd.variable === dest && rd.index !== node.instrRow()))
        }

        return []
      }

      const machine = new DataFlowMachine(genFunc, killFunc, mergeFunc).loadBlocks(blocks)

      machine.init(
        machine.graph.root.index(), (func.args ?? []).map((arg) => new RDData(arg.name, func.pos.row))
      )

      try {
        machine.run()
      } catch (e) {
        console.log(e)
        return [
          func.name,
          new Map(),
        ]
      }


      const result: FuncRD = new Map(Array.from(machine.dataIn.entries()).map(([index, data]) => {

        const lineResult = data.reduce((acc, rd) => {
          if (acc.get(rd.variable) === undefined)
            acc.set(rd.variable, new Set())
          acc.get(rd.variable)?.add(rd.index)
          return acc
        }, new Map() as RDLine)

        return [index, lineResult]
      }))


      return [func.name, result]
    })
  )
}
