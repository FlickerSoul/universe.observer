import type { Program } from './types'
import type { InstrNode } from './group-basic-blocks'
import { blocksToPlainGraph, groupBasicBlocksForFun } from './group-basic-blocks'

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

export function reachingDefinition(prog: Program): RDResult {
  return new Map(
    prog.functions.map((func) => {
      const blocks = groupBasicBlocksForFun(func)
      const graph = blocksToPlainGraph(blocks)
      const root = graph.root
      const result: FuncRD = new Map<number, RDLine>()

      if (root === undefined) {
        return [
          func.name,
          result,
        ]
      }

      const rdOuts = new Map<InstrNode, RDLine>()
      for (const node of graph.nodes.values())
        rdOuts.set(node, new Map() as RDLine)

      const workList = new Deque<InstrNode>()

      for (const node of graph.nodes.values())
        workList.pushBack(node)

      while (!workList.isEmpty()) {
        const node = workList.popFront()
        const rdIn = node.prev.reduce((acc, node) => {
          rdOuts.get(node).forEach((lineNums, varName) => {
            if (acc.get(varName) === undefined)
              acc.set(varName, new Set())

            for (const lineNum of lineNums)
              acc.get(varName)?.add(lineNum)
          })
          return acc
        }, new Map() as RDLine)

        const instr = node.instr
        result.set(node.instrRow(), rdIn)

        const rdOut: RDLine = new Map(rdIn)

        if ('dest' in instr) {
          const writeVar = instr.dest
          rdOut.set(writeVar, new Set([node.instrRow()]))
        }

        if (!mapEqual(rdOut, rdOuts.get(node))) {
          rdOuts.set(node, rdOut)
          for (const succ of node.next)
            workList.pushBack(succ)
        }
      }

      return [
        func.name,
        result,
      ]
    })) as RDResult
}
