export interface IPostData {
  title?: string
  subtitle?: string
  createdAt?: string
  updatedAt?: string
  tags?: string[]
  lang?: string
}

export interface IListedPostData {
  path: string
  title: string
  createdAt: string
  lang: string
}
