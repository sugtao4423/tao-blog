import { CommonResponse, PaginationCommonResponse } from './common_response'

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

export type GetPostComments = CommonResponse<GetComment[]>

export type PaginationGetComments = PaginationCommonResponse<GetComment>

export type CreateComment = {
  parentId: number | null
  authorId: number | null
  author: {
    name: string
    email: string
    url: string | null
  } | null
  content: string
}

export type CreatedComment = CommonResponse<'OK' | 'NG'>

export type DeletedComment = CommonResponse<'OK' | 'NG'>
