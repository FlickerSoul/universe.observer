import type { SupportedLangs } from '../../scripts/lang'

export type LangType = keyof typeof SupportedLangs

export interface IPostData {
  // title of the post
  title?: string
  // subtitle of the post
  subtitle?: string
  // abstract of the post
  abstract?: string
  // path of the post
  createdAt?: string
  // path of the post
  updatedAt?: string
  // path of the post
  tags?: string[]
  // languages of this post
  lang?: LangType
  langs?: LangType[]
  // display this post in the list without title
  display?: boolean
  // whether this post is hidden
  hidden?: boolean
  // whether should display comments in this post
  hasComments?: boolean
  // excerpt of a post
  excerpt?: string
  // description of the post
  description?: string
  // is this working in progress
  wip?: boolean
}

export type IListedPostData = Omit<
  IPostData,
  'display' | 'hasComments' | 'createdAt' | 'updatedAt'
> & {
  path: string
  createdAt?: Date
  updatedAt?: Date
}
