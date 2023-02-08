import { Generated } from 'kysely'

export type UserTable = {
  readonly id: Generated<number>
  name: string
  email: string
  password: string
  url: string
  createdAt: string
}

export type TagTable = {
  readonly id: Generated<number>
  name: string
  createdAt: string
}

export type CommentTable = {
  readonly id: Generated<number>
  parantId: number | null
  postId: number
  authorId: number | null
  authorName: string | null
  authorEmail: string | null
  authorUrl: string | null
  authorIp: string | null
  authorUserAgent: string | null
  content: string
  createdAt: string
}

export type PostTable = {
  readonly id: Generated<number>
  title: string
  content: string
  abstract: string
  thumbnailUrl: string | null
  authorId: number
  tagIds: string | null
  status: 'publish' | 'draft' | 'hidden'
  commentable: boolean
  createdAt: string
  updatedAt: string
}

export type DatabaseTables = {
  users: UserTable
  tags: TagTable
  comments: CommentTable
  posts: PostTable
}
