export interface IPostData {
  title?: string
  subtitle?: string
  abstract?: string
  createdAt?: string
  updatedAt?: string
  tags?: string[]
  lang?: string
  langs?: string[]
  display?: boolean
  hasComments?: boolean
  description?: string
}

export type IListedPostData = Omit<IPostData, 'display' | 'hasComments'> & { path: string; title: string }
