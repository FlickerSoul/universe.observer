export interface IInfoItem {
  icon: string
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
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
  Python = 'Python',
  Django = 'Django',
  ORM = 'ORM',
  PostgreSQL = 'PostgreSQL',
  Jupyter = 'Jupyter Notebook',
  CPP = 'C/++',
  Rust = 'Rust',
  GLSL = 'GLSL',
  WebGL = 'WebGL',
  flex = 'flex',
  bison = 'bison',
  Latex = 'Latex',
  GitHubCI = 'GitHub CI',
}

interface _IContentItem {
  title: string
  role?: string
  url?: string
  descriptions: string[] | string
  techStack?: TechItems[]
  startDate?: string
  endDate?: string
}

export type IContentItem = _IContentItem | (_IContentItem & HasStartDate) | (_IContentItem & HasEndDate)
