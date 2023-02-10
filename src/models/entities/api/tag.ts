import { CommonResponse, PaginationCommonResponse } from './common_response'

export type GetTag = {
  readonly id: number
  name: string
  createdAt: number
}

export type CreateTag = {
  name: string
}

export type CreatedTag = CommonResponse<'OK' | 'NG'>

export type PaginationGetTags = PaginationCommonResponse<GetTag>
