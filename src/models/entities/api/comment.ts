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
