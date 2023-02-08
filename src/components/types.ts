export interface IPostData {
  title?: string
  subtitle?: string
  createdAt?: string
  updatedAt?: string
  tags?: string[]
  lang?: string
  display?: boolean
}

export interface IListedPostData {
  path: string
  title: string
  createdAt?: string
  updatedAt?: string
  lang?: string
  tags?: string[]
}
