import { GetTag } from './tag'
import { GetUser } from './user'

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
