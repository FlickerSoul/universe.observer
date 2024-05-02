/**
 * Convert a Bril instruction to a human-readable string.
 * Credit: https://github.com/sampsyo/bril/blob/main/bril-txt/briltxt.py
 */
import type { Argument, FuncInstruction, IFunction, Instruction, Label, Position, Program, Type, Value } from './types'
import type { BasicBlock } from './group-basic-blocks'
import { START_LABEL } from './group-basic-blocks'

const controlChars = {
  '\\0': 0,
  '\\a': 7,
  '\\b': 8,
  '\\t': 9,
  '\\n': 10,
  '\\v': 11,
  '\\f': 12,
  '\\r': 13,
}

function labelToText(label: Label): string {
  return `.${label.label}:`
}

function instrToString(instr: Instruction) {
  if (instr['op'] === 'const') {
    const tyann = 'type' in instr ? `: ${typeToStr(instr['type'])}` : ''
    return `${instr['dest']}${tyann} = const ${valueToStr(instr['type'], instr['value'])};`
  } else {
    let rhs = instr['op']
    if ('funcs' in instr)
      rhs += ` ${instr['funcs']?.map(f => `@${f}`).join(' ')}`

    if ('args' in instr)
      rhs += ` ${instr['args']?.join(' ')}`

    if ('labels' in instr)
      rhs += ` ${instr['labels']?.map(f => `.${f}`).join(' ')}`

    if ('dest' in instr) {
      const tyann = 'type' in instr ? `: ${typeToStr(instr['type'])}` : ''
      return `${instr['dest']}${tyann} = ${rhs};`
    } else {
      return `${rhs};`
    }
  }
}

function typeToStr(type: Type): string {
  if (typeof type === 'object' && type !== null) {
    const keys = Object.keys(type)
    if (keys.length === 1) {
      const key = keys[0]
      return `${key}<${typeToStr(type[key])}>`
    } else {
      throw new Error(`Invalid type: ${type}`)
    }
  } else {
    return type
  }
}

function valueToStr(type: Type, value: Value) {
  if (typeof type === 'string' && type.toLowerCase() === 'char') {
    const controlCharsReverse = Object.fromEntries(Object.entries(controlChars).map(([k, v]) => [v, k]))
    if ((value as string).charCodeAt(0) in controlCharsReverse)
      value = controlCharsReverse[(value as string).charCodeAt(0)]

    return `'${value}'`
  } else {
    return value.toString().toLowerCase()
  }
}

export function brilInstructionToText(instr: Instruction | Label): string {
  if ('label' in instr)
    return labelToText(instr)
  else
    return instrToString(instr)
}

function argsToString(args: Argument[]) {
  if (args && args.length > 0) {
    const argsStr = args.map(arg => `${arg.name}: ${typeToStr(arg.type)}`).join(', ')
    return `(${argsStr})`
  } else {
    return ''
  }
}

export function brilFuncToText(func: IFunction): string {
  const funcType = func.type
    ? `: ${typeToStr(func.type)}`
    : ''
  const funcHeader = `@${func['name']}${argsToString(func.args ?? [])}${funcType} {`
  const funcEnd = '}'
  const body = func.instrs.map((instr) => {
    if ('label' in instr)
      return labelToText(instr)
    else
      return `  ${instrToString(instr)}`
  }).join('\n')

  return `${funcHeader}\n${body}\n${funcEnd}`
}

export function brilFuncsToText(funcs: IFunction[]): string {
  return funcs.map((func) => {
    return brilFuncToText(func)
  }).join('\n')
}

export function basicBlockToInstructions(funcName: string, block: BasicBlock): FuncInstruction[] {
  let label: string | undefined = block.label
  const pattern = /^(?<funcName>[^.]+?)\.(?<suffix>[^.]+)$/
  const match = label.match(pattern)

  if (match && match.groups) {
    const labelFuncName = match.groups.funcName
    const suffix = match.groups.suffix

    if (labelFuncName === funcName && (suffix === START_LABEL || suffix.startsWith('l')))
      label = undefined
  }

  const instructions: FuncInstruction[] = []
  if (label)
    instructions.push({ label })

  instructions.push(...block.instrs)

  return instructions
}

export function funcBlocksToFunc(
  funcName: string,
  blocks: BasicBlock[],
  args: undefined | Argument[] = undefined,
  type: undefined | Type = undefined,
  pos: undefined | Position = undefined,
): IFunction {
  return {
    name: funcName,
    instrs: blocks.reduce((left, block) => {
      return left.concat(basicBlockToInstructions(funcName, block))
    }, [] as FuncInstruction[]),
    args,
    type,
    pos,
  }
}

export function brilProgramToText(prog: Program): string {
  return brilFuncsToText(prog.functions)
}
