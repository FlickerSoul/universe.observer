export interface IPostData {
  title?: string
  subtitle?: string
  abstract?: string
  createdAt?: string | Date
  updatedAt?: string | Date
  tags?: string[]
  lang?: string
  langs?: string[]
  display?: boolean
  hidden?: boolean
  hasComments?: boolean
  description?: string
}

export type IListedPostData =
  Omit<IPostData, 'display' | 'hasComments'> & { path: string; createdAt?: Date; updatedAt?: Date }
