import { CommonResponse, PaginationCommonResponse } from './common_response'

export type GetTag = {
  readonly id: number
  name: string
  createdAt: number
}

export type PaginationGetTags = PaginationCommonResponse<GetTag>

export type CreateTag = {
  name: string
}

export type CreatedTag = CommonResponse<'OK' | 'NG'>

export type UpdateTag = CreateTag

export type UpdatedTag = CreatedTag
