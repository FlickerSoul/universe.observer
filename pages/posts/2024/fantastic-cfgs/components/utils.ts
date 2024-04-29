export enum ProgramDisplayType {
  PROGRAM,
  CFG,
  CFG_BASIC_BLOCKS,
  DCE,
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
  }
}

export interface OptionalDisplays {
  dce?: string[]
}

export function addDisplays(displays: ProgramDisplayType[], optionalDisplays: OptionalDisplays | undefined) {
  if (optionalDisplays?.dce)
    displays.push(ProgramDisplayType.DCE)

  return displays
}
