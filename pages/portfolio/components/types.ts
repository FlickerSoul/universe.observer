export interface IInfoItem {
  icon: string
  value: string
  url?: string
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
  Vue = "Vue",
  TypeScript = "TypeScript",
  Python = "Python",
  Django = "Django",
  ORM = "ORM",
  PostgreSQL = "PostgreSQL",
  Jupyter = "Jupyter Notebook",
  CPP = "C/++",
  Rust = "Rust",
  GLSL = "GLSL",
  flex = "flex",
  bison = "bison",
}

interface _IContentItem {
  title: string
  role: string
  url?: string
  descriptions: string[] | string
  techStack?: TechItems[]
  startDate?: string
  endDate?: string

}

export type IContentItem = _IContentItem | (_IContentItem & HasStartDate) | (_IContentItem & HasEndDate)

