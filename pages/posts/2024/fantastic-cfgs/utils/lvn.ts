import type { BasicBlock } from './group-basic-blocks'
import { groupBasicBlocksForFun } from './group-basic-blocks'
import type {
  Constant,
  Instruction,
  Operation,
  Program,
  ValueInstruction,
} from './types'
import { funcBlocksToFunc } from './bril-txt'

type RefType = string
type FundamentalVariableType = number | boolean

interface Op {
  type: 'unop' | 'binop' | 'unknown'
  op: Instruction['op']
  refs: RefType[]
  value: FundamentalVariableType
}

interface UnOp extends Op {
  type: 'unop'
}

interface BinOp extends Op {
  type: 'binop'
  commutative: boolean
}

interface CommutativeOp extends BinOp {
  commutative: true
}

interface NonCommutativeOp extends BinOp {
  commutative: false
}

function instrToDest(instr: Instruction): string | undefined {
  if ('dest' in instr) return instr.dest
  return undefined
}

function instrToOp(instr: Instruction): Op | undefined {
  switch (instr.op) {
    case 'add':
    case 'mul':
    case 'eq':
    case 'ceq':
    case 'feq':
    case 'and':
    case 'or':
      return <BinOp>{
        type: 'binop',
        op: instr.op,
        commutative: true,
        refs: Array.from(instr.args),
      }

    case 'sub':
    case 'div':
    case 'ge':
    case 'fge':
    case 'cge':
    case 'gt':
    case 'fgt':
    case 'cgt':
    case 'le':
    case 'fle':
    case 'cle':
    case 'lt':
    case 'flt':
    case 'clt':
      return <BinOp>{
        type: 'binop',
        op: instr.op,
        commutative: false,
        refs: Array.from(instr.args),
      }

    case 'id':
    case 'not':
    case 'char2int':
    case 'int2char':
    case 'guard':
    case 'print':
    case 'ret':
      return <UnOp>{
        type: 'unop',
        op: instr.op,
        refs: Array.from(instr.args),
      }
    case 'const':
      return <UnOp>{
        type: 'unop',
        op: instr.op,
        value: instr.value,
      }

    case 'br':
      return <UnOp>{
        type: 'unop',
        op: instr.op,
        refs: Array.from(instr.args[0]),
      }

    case 'jmp':
    case 'speculate':
    case 'commit':
      return undefined

    // TODO: memeory extension
  }
}

type Counter = number

interface ValueOp {
  type: string
  op: string
  refs: Counter[]
  value?: FundamentalVariableType
}

type InstrIndex = number

interface Commit {
  value?: FundamentalVariableType
  ref?: string
}

class NumberPool {
  numberMap: Map<Counter, ValueOp> = new Map()
  reverseNumberMap: Map<string, Counter> = new Map()
  variableMap: Map<string, Counter> = new Map()
  reverseVariableMap: Map<Counter, Set<string>> = new Map()
  counter: Counter = 0
  variableCommits: Map<InstrIndex, Map<string, Commit>> = new Map()

  bumpCounter(): Counter {
    return this.counter++
  }

  updateWithInstruction(
    instr: Instruction,
    instrIndex: number,
  ): Commit | undefined {
    const op = instrToOp(instr)

    // if the operation uses variables, record which variables they used and their numbers
    if (!op) return undefined

    const valueOp = this.opToValueOp(op)

    if (op.refs && op.refs.length > 0) {
      for (const refVar of op.refs) {
        const usedRefVarNumber = this.variableMap.get(refVar)
        if (usedRefVarNumber === undefined) continue

        // record the variables that are used
        this.commitVariable(refVar, usedRefVarNumber, instrIndex)
      }
    }

    const dest = instrToDest(instr)
    // if the operation does not produce a value, return
    if (!dest) return undefined

    // get the value from the operation
    // get the number of the value
    let valueOpNumber = this.reverseNumberMap.get(JSON.stringify(valueOp))

    if (valueOpNumber === undefined) {
      // if the value is new
      // we need to update the number map
      valueOpNumber = this.bumpCounter()
      this.setNumber(valueOpNumber, valueOp)
    }

    const commit = this.generateCommit(valueOpNumber)

    this.setVariable(dest, valueOpNumber)

    return commit
  }

  setNumber(number: Counter, value: ValueOp) {
    this.numberMap.set(number, value)
    this.reverseNumberMap.set(JSON.stringify(value), number)
  }

  setVariable(varName: string, number: Counter) {
    if (!this.reverseVariableMap.has(number))
      this.reverseVariableMap.set(number, new Set())

    // add new number
    this.reverseVariableMap.get(number)!.add(varName)

    // delete old thing
    const oldNumber = this.variableMap.get(varName)!
    if (oldNumber !== undefined)
      this.reverseVariableMap.get(oldNumber)!.delete(varName)

    this.variableMap.set(varName, number)
  }

  generateCommit(varNumber: Counter): Commit | undefined {
    const value = this.numberMap.get(varNumber)

    let commit: Commit | undefined

    if (value?.op === 'const') {
      commit = {
        value: value.value,
      }
    }

    const refVar = this.reverseVariableMap.get(varNumber)
    if (refVar !== undefined) {
      commit = {
        ...(commit || {}),
        ref: refVar.values().next().value, // use the "oldest" variable as the reference for consistency
      }
    }

    return commit
  }

  commitVariable(varName: string, varNumber: Counter, instrIndex: number) {
    if (!this.variableCommits.has(instrIndex))
      this.variableCommits.set(instrIndex, new Map())

    const instrCommit = this.variableCommits.get(instrIndex)!

    const commit = this.generateCommit(varNumber)
    if (commit === undefined) throw new Error('Commit should not be undefined')

    instrCommit.set(varName, commit)
  }

  opToValueOp(op: Op): ValueOp {
    if (op.op === 'const') {
      return {
        type: op.type,
        op: op.op,
        refs: [],
        value: op.value,
      }
    } else if (op.op === 'id') {
      const varName = op.refs[0]
      let variableNumber = this.variableMap.get(varName)
      if (variableNumber === undefined)
        variableNumber = this.updateWithVariable(varName)
      return this.numberMap.get(variableNumber)!
    } else {
      return {
        type: op.type,
        op: op.op,
        refs: op.refs.map(variable => {
          let variableNumber = this.variableMap.get(variable)
          if (variableNumber === undefined)
            variableNumber = this.updateWithVariable(variable)

          return variableNumber
        }),
      }
    }
  }

  unknownValue(number: Counter): ValueOp {
    return {
      type: 'unknown',
      op: 'unknown',
      refs: [number],
    }
  }

  updateWithVariable(varName: string): Counter {
    const number = this.bumpCounter()
    const value = this.unknownValue(number)
    this.setNumber(number, value)
    this.setVariable(varName, number)

    return number
  }
}

export function applyLVNForBlock(block: BasicBlock) {
  const pool = new NumberPool()
  block.instrs.forEach((instr, index) => {
    const destSwap = pool.updateWithInstruction(instr, index)
    // swap instruction
    if (destSwap) {
      if ('value' in destSwap) {
        const value = destSwap.value
        block.instrs[index] = <Constant>{
          op: 'const',
          value,
          dest: (instr as ValueInstruction).dest,
          type: (instr as ValueInstruction).type,
          pos: instr.pos,
        }
      } else if ('ref' in destSwap) {
        const ref = destSwap.ref
        block.instrs[index] = <ValueInstruction>{
          op: 'id',
          args: [ref],
          dest: (instr as ValueInstruction).dest,
          type: (instr as ValueInstruction).type,
          pos: instr.pos,
        }
      } else {
        throw new Error('Commit should have either value or ref')
      }
    } else {
      const argSwap = pool.variableCommits.get(index)
      if (argSwap && argSwap.size > 0) {
        ;(instr as Operation).args = (instr as Operation).args?.map(arg => {
          return argSwap.get(arg)?.ref || arg
        })
      }
    }
  })
}

export function applyLvnToProgram(prog: Program): Program {
  return {
    functions: prog.functions.map(func => {
      const blocks = groupBasicBlocksForFun(func).map(block => {
        applyLVNForBlock(block)
        return block
      })

      return funcBlocksToFunc(func.name, blocks, func.args, func.type, func.pos)
    }),
  } as Program
}
