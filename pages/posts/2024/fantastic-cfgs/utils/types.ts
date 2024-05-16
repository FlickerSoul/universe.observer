/**
 * The definition of types in the Bril language.
 * Credit: https://github.com/sampsyo/bril/blob/main/bril-ts/types.ts
 */

/**
 * A variable name.
 */
export type Ident = string

/**
 * Primitive types.
 */
export type PrimType = 'int' | 'bool' | 'float' | 'char'

/**
 * Parameterized types. (We only have pointers for now.)
 */
export interface ParamType {
  ptr: Type

  [key: string]: Type
}

/**
 * Value types.
 */
export type Type = PrimType | ParamType

/**
 * An (always optional) source code position.
 */
export interface Position {
  row: number
  col: number
}

/**
 * Common fields in any operation.
 */
interface Op {
  args?: Ident[]
  funcs?: Ident[]
  labels?: Ident[]
  pos?: Position
}

/**
 * An instruction that does not produce any result.
 */
export interface EffectOperation extends Op {
  op:
    | 'br'
    | 'jmp'
    | 'print'
    | 'ret'
    | 'call'
    | 'store'
    | 'free'
    | 'speculate'
    | 'guard'
    | 'commit'
    | 'noop'
}

/**
 * An operation that produces a value and places its result in the
 * destination variable.
 */
export interface ValueOperation extends Op {
  op:
    | 'add'
    | 'mul'
    | 'sub'
    | 'div'
    | 'id'
    | 'nop'
    | 'eq'
    | 'lt'
    | 'gt'
    | 'ge'
    | 'le'
    | 'not'
    | 'and'
    | 'or'
    | 'call'
    | 'load'
    | 'ptradd'
    | 'alloc'
    | 'fadd'
    | 'fmul'
    | 'fsub'
    | 'fdiv'
    | 'feq'
    | 'flt'
    | 'fle'
    | 'fgt'
    | 'fge'
    | 'ceq'
    | 'clt'
    | 'cle'
    | 'cgt'
    | 'cge'
    | 'char2int'
    | 'int2char'
    | 'phi'
  dest: Ident
  type: Type
}

/**
 * The type of Bril values that may appear in constants.
 */
export type Value = number | boolean | string

/**
 * An instruction that places a literal value into a variable.
 */
export interface Constant {
  op: 'const'
  value: Value
  dest: Ident
  type: Type
  pos?: Position
}

/**
 * Operations take arguments, which come from previously-assigned identifiers.
 */
export type Operation = EffectOperation | ValueOperation

/**
 * Instructions can be operations (which have arguments) or constants (which
 * don't). Both produce a value in a destination variable.
 */
export type Instruction = Operation | Constant

/**
 * Both constants and value operations produce results.
 */
export type ValueInstruction = Constant | ValueOperation

/**
 * The valid opcodes for value-producing instructions.
 */
export type ValueOpCode = ValueOperation['op']

/**
 * The valid opcodes for effecting operations.
 */
export type EffectOpCode = EffectOperation['op']

/**
 * All valid operation opcodes.
 */
export type OpCode = ValueOpCode | EffectOpCode

/**
 * Jump labels just mark a position with a name.
 */
export interface Label {
  label: Ident
  pos?: Position
}

/*
 * An argument has a name and a type.
 */
export interface Argument {
  name: Ident
  type: Type
}

export type FuncInstruction = Instruction | Label

/**
 * A function consists of a sequence of instructions.
 */
export interface IFunction {
  name: Ident
  args?: Argument[]
  instrs: FuncInstruction[]
  type?: Type
  pos?: Position
}

/**
 * A program consists of a set of functions, one of which must be named
 * "main".
 */
export interface Program {
  functions: IFunction[]
}

/**
 * An abstract type signature.
 *
 * Describes the shape and types of all the ingredients for a Bril operation
 * instruction: arguments, result, labels, and functions.
 */
export interface BaseSignature<T> {
  /**
   * The types of each argument to the operation.
   */
  args: T[]

  /**
   * The result type, if non-void.
   */
  dest?: T

  /**
   * The number of labels required for the operation.
   */
  labels?: number

  /**
   * The number of function names required for the operation.
   */
  funcs?: number
}

/**
 * The concrete type signature for an operation.
 */
export type Signature = BaseSignature<Type>

/**
 * A polymorphic type variable.
 */
export interface TVar {
  tv: string
}

/**
 * Like bril.Type, except that type variables may occur at the leaves.
 */
export type PolyType = PrimType | TVar | { ptr: PolyType }

/**
 * A polymorphic type signature, universally quantified over a single
 * type variable.
 */
export interface PolySignature {
  tvar: TVar
  sig: BaseSignature<PolyType>
}

/**
 * The type of a Bril function.
 */
export interface BFuncType {
  /**
   * The types of the function's arguments.
   */
  args: Type[]

  /**
   * The function's return type.
   */
  ret: Type | undefined
}

/**
 * Type signatures for the Bril operations we know.
 */
export const OP_SIGS: { [key: string]: Signature | PolySignature } = {
  // Core.
  add: { args: ['int', 'int'], dest: 'int' },
  mul: { args: ['int', 'int'], dest: 'int' },
  sub: { args: ['int', 'int'], dest: 'int' },
  div: { args: ['int', 'int'], dest: 'int' },
  eq: { args: ['int', 'int'], dest: 'bool' },
  lt: { args: ['int', 'int'], dest: 'bool' },
  gt: { args: ['int', 'int'], dest: 'bool' },
  le: { args: ['int', 'int'], dest: 'bool' },
  ge: { args: ['int', 'int'], dest: 'bool' },
  not: { args: ['bool'], dest: 'bool' },
  and: { args: ['bool', 'bool'], dest: 'bool' },
  or: { args: ['bool', 'bool'], dest: 'bool' },
  jmp: { args: [], labels: 1 },
  br: { args: ['bool'], labels: 2 },
  id: { tvar: { tv: 'T' }, sig: { args: [{ tv: 'T' }], dest: { tv: 'T' } } },
  nop: { args: [] },

  // Floating point.
  fadd: { args: ['float', 'float'], dest: 'float' },
  fmul: { args: ['float', 'float'], dest: 'float' },
  fsub: { args: ['float', 'float'], dest: 'float' },
  fdiv: { args: ['float', 'float'], dest: 'float' },
  feq: { args: ['float', 'float'], dest: 'bool' },
  flt: { args: ['float', 'float'], dest: 'bool' },
  fgt: { args: ['float', 'float'], dest: 'bool' },
  fle: { args: ['float', 'float'], dest: 'bool' },
  fge: { args: ['float', 'float'], dest: 'bool' },

  // Memory.
  alloc: {
    tvar: { tv: 'T' },
    sig: { args: ['int'], dest: { ptr: { tv: 'T' } } },
  },
  free: { tvar: { tv: 'T' }, sig: { args: [{ ptr: { tv: 'T' } }] } },
  store: {
    tvar: { tv: 'T' },
    sig: { args: [{ ptr: { tv: 'T' } }, { tv: 'T' }] },
  },
  load: {
    tvar: { tv: 'T' },
    sig: { args: [{ ptr: { tv: 'T' } }], dest: { tv: 'T' } },
  },
  ptradd: {
    tvar: { tv: 'T' },
    sig: { args: [{ ptr: { tv: 'T' } }, 'int'], dest: { ptr: { tv: 'T' } } },
  },

  // Speculation.
  speculate: { args: [] },
  commit: { args: [] },
  guard: { args: ['bool'], labels: 1 },

  // Character.
  ceq: { args: ['char', 'char'], dest: 'bool' },
  clt: { args: ['char', 'char'], dest: 'bool' },
  cgt: { args: ['char', 'char'], dest: 'bool' },
  cle: { args: ['char', 'char'], dest: 'bool' },
  cge: { args: ['char', 'char'], dest: 'bool' },
  char2int: { args: ['char'], dest: 'int' },
  int2char: { args: ['int'], dest: 'char' },
}
