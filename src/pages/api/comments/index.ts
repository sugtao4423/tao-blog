import {
  CreatedComment,
  PaginationGetComments,
} from '@/models/entities/api/comment'
import CommentsService from '@/services/api/comments'
import { parsePagination } from '@/services/api/pagination'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PaginationGetComments | CreatedComment>
) => {
  if (req.method === 'GET') {
    const pagination = parsePagination(req)
    const comments = await new CommentsService(pagination).getComments()
    res.status(comments.code).json(comments)
    return
  }

  const error = CommentsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default handler
