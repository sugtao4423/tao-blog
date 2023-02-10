import Pagination from './pagination'

export type CommonResponse<T> = {
  code: number
  error?: boolean
  message?: string
  data: T
}

export type PaginationCommonResponse<T> = {
  pagination: Pagination
} & CommonResponse<T[]>
