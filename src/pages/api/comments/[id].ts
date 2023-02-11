import {
  CreatedComment,
  PaginationGetComments,
} from '@/models/entities/api/comment'
import { withModifyAuth } from '@/services/api/api_handler'
import CommentsService from '@/services/api/comments'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PaginationGetComments | CreatedComment>
) => {
  if (req.method === 'DELETE') {
    const deleted = await CommentsService.deleteComment(req)
    res.status(deleted.code).json(deleted)
    return
  }

  const error = CommentsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default withModifyAuth(handler)
