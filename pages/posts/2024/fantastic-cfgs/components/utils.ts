export enum ProgramDisplayType {
  PROGRAM,
  CFG,
  CFG_BASIC_BLOCKS,
  DCE,
  LVN,
}

export function programDisplayTypeToName(type: ProgramDisplayType): string {
  switch (type) {
    case ProgramDisplayType.PROGRAM:
      return 'Program'
    case ProgramDisplayType.CFG:
      return 'CFG'
    case ProgramDisplayType.CFG_BASIC_BLOCKS:
      return 'Only Basic Blocks'
    case ProgramDisplayType.DCE:
      return 'DCE'
    case ProgramDisplayType.LVN:
      return 'LVN'
  }
}

export interface OptionalDisplays {
  dce?: string[]
  lvn?: boolean
  sdom?: boolean
  dom?: boolean
}

export function addDisplays(
  displays: ProgramDisplayType[],
  optionalDisplays: OptionalDisplays | undefined,
) {
  if (optionalDisplays?.dce) displays.push(ProgramDisplayType.DCE)

  if (optionalDisplays?.lvn) displays.push(ProgramDisplayType.LVN)

  return displays
}
