import { CreatedComment } from '@/models/entities/api/comment'
import CommentsService from '@/services/api/comments'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreatedComment>
) => {
  if (req.method === 'POST') {
    const created = await CommentsService.createComment(req)
    res.status(created.code).json(created)
    return
  }

  const error = CommentsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default handler
