import { CommonResponse, PaginationCommonResponse } from './common_response'
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

export type GetSpecificPost = CommonResponse<GetPost | null>

export type PaginationGetPosts = PaginationCommonResponse<GetPost>

export type CreatePost = {
  title: string
  content: string
  abstract: string
  thumbnailUrl: string | null
  authorId: number
  tagIds: number[]
  status: 'publish' | 'draft' | 'hidden'
  commentable: boolean
}

export type CreatedPost = CommonResponse<'OK' | 'NG'>

export type UpdatePost = Partial<CreatePost>

export type UpdatedPost = CreatedPost

export type DeletedPost = CreatedPost
