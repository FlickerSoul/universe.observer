export enum ProgramDisplayType {
  PROGRAM,
  CFG,
  CFG_BASIC_BLOCKS,
}

export function programDisplayTypeToName(type: ProgramDisplayType): string {
  switch (type) {
    case ProgramDisplayType.PROGRAM:
      return 'Program'
    case ProgramDisplayType.CFG:
      return 'CFG'
    case ProgramDisplayType.CFG_BASIC_BLOCKS:
      return 'Only Basic Blocks'
  }
}
