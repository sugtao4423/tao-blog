import { GetTag } from '../api'
import Pagination from './pagination'

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
