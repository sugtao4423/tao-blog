import Pagination from './pagination'

export type GetTag = {
  readonly id: number
  name: string
  createdAt: number
}

export type CreateTag = {
  name: string
}

export type CreatedTag = {
  error?: boolean
  message?: string
  code: number
}

export type PaginationGetTags = {
  error?: boolean
  message?: string
  code: number
  pagination: Pagination
  tags: GetTag[]
}
