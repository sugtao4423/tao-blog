import { Generated } from 'kysely'

export type UserTable = {
  readonly id: Generated<number>
  name: string
  email: string
  password: string
  url: string | null
  createdAt: string
}

export type LoginUser = Omit<UserTable, 'id' | 'password' | 'createdAt'> & {
  id: number
  hashedPassword: string
  createdAt: number
}

export type TagTable = {
  readonly id: Generated<number>
  name: string
  createdAt: string
}

export type CommentTable = {
  readonly id: Generated<number>
  parentId: number | null
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
  tagIds: string
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

export type DatabasePagination = {
  offset: number
  limit: number
}
