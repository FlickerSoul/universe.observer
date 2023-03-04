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
}

export type IListedPostData = Omit<IPostData, 'display'> & { path: string; title: string }
