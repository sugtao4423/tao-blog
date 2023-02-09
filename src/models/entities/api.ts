export type GetUser = {
  readonly id: number
  name: string
  url: string
  createdAt: number
}

export type GetTag = {
  readonly id: number
  name: string
  createdAt: number
}

export type GetComment = {
  readonly id: number
  parentId: number | null
  postId: number
  author: {
    id: number | null
    name: string
    url: string | null
  } | null
  content: string
  createdAt: number
}

export type GetPost = {
  readonly id: number
  title: string
  content: string
  abstract: string
  thumbnailUrl: string | null
  author: GetUser
  tags: GetTag[]
  status: 'publish' | 'draft' | 'hidden'
  commentable: boolean
  createdAt: number
  updatedAt: number
}
