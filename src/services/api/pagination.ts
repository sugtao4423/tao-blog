import Pagination from '@/models/entities/api/pagination'
import { NextApiRequest } from 'next'

const DEFAULT_PAGE = 1
const DEFAULT_COUNT = 10

/**
 * Parse pagination query params
 * @param req `NextApiRequest`
 * @returns `Pagination`
 */
export const parsePagination = (req: NextApiRequest): Pagination | null => {
  if (!req.query.p && !req.query.c) return null

  const stringNum = (str: unknown, init: number): number => {
    const num = Number(str) || init
    return num > 0 ? num : init
  }
  const page = stringNum(req.query.p, DEFAULT_PAGE)
  const count = stringNum(req.query.c, DEFAULT_COUNT)

  return { page, count }
}
