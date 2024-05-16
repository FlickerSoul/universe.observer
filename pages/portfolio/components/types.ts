export interface IInfoItem {
  icon: string
  name: string
  value: string
  url?: string
  mono?: boolean
}

interface HasStartDate {
  startDate: string
  endDate?: string
}

interface HasEndDate extends HasStartDate {
  startDate: string
  endDate: string
}

export enum TechItems {
  Vue = 'Vue',
  Vite = 'Vite',
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
  Python = 'Python',
  Django = 'Django',
  ORM = 'ORM',
  PostgreSQL = 'PostgreSQL',
  Jupyter = 'Jupyter Notebook',
  CPP = 'C/C++',
  Rust = 'Rust',
  GLSL = 'GLSL',
  WebGL = 'WebGL',
  flex = 'flex',
  bison = 'bison',
  Latex = 'Latex',
  GitHubCICD = 'GitHub CICD',
  Communication = 'Communication',
  Kotlin = 'Kotlin',
  Hilt = 'Hilt',
  Jetpack = 'Jetpack Compose',
}

interface _IContentItem {
  title: string
  role?: string
  url?: { url: string; text?: string }
  descriptions: string[] | string
  techStack?: TechItems[]
  startDate?: string
  endDate?: string
}

export type IContentItem =
  | _IContentItem
  | (_IContentItem & HasStartDate)
  | (_IContentItem & HasEndDate)

export interface ISkillItem {
  name: string
  url?: string
  note?: string
}

export interface ISkillSection {
  name: string
  skills: ISkillItem[]
}
