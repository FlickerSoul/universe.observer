import type {Element} from "hast";
import {Program} from "../../pages/posts/2024/fantastic-cfgs/utils/types";
import {execSync} from "node:child_process";
import {loadBril} from "../../pages/posts/2024/fantastic-cfgs/utils/tools";

export const BRIL_FLOATING_VUE_THEME = 'bril'

export function calculateOffset(row: number, col: number, code: string[]) {
  const index = row - 2
  if (index < 0)
    return col

  return code.reduce((acc, line, idx) => {
    if (idx <= index)
      return acc + line.length + 1
    return acc
  }, 0) + col
}

export const VARIABLE_SCOPE = 'meta.variable.bril'
export const DEST_VARIABLE_SCOPE = 'meta.variable.dest.bril'
export const BASIC_POPPER_PROPERTIES = {
  class: 'bril-hover',
  theme: BRIL_FLOATING_VUE_THEME,
  popperClass: 'shiki bril-floating',
}

export function addIdToHast(hast: Element, id: string) {
  if (hast.properties === undefined)
    hast.properties = {}

  hast.properties.id = id
  return hast
}

export function generateId(lang: string, prefix: string, row: number, variable: string) {
  const escapedVariable = variable.replace(/[^a-zA-Z0-9]/g, '-')
  return `${lang}-${prefix}-${row}-${escapedVariable}`
}

export function generateFlickerCallbackEffect(id: string) {
  return `flicker('${id}')`
}

export function codeStringToProgram(code: string): Program {

  const cmd = execSync('bril2json -p', {input: code})
  const json = cmd.toString()

  return loadBril(JSON.parse(json))
}
