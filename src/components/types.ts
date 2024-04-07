export interface IPostData {
  // title of the post
  title?: string
  // subtitle of the post
  subtitle?: string
  // abstract of the post
  abstract?: string
  // path of the post
  createdAt?: string | Date
  // path of the post
  updatedAt?: string | Date
  // path of the post
  tags?: string[]
  // languages of this post
  lang?: string
  langs?: string[]
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
}

export type IListedPostData =
  Omit<IPostData, 'display' | 'hasComments'> & { path: string; createdAt?: Date; updatedAt?: Date }
