import { CreatedComment, GetPostComments } from '@/models/entities/api/comment'
import CommentsService from '@/services/api/comments'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreatedComment | GetPostComments>
) => {
  if (req.method === 'POST') {
    const created = await CommentsService.createComment(req)
    res.status(created.code).json(created)
    return
  }
  if (req.method === 'GET') {
    const comments = await CommentsService.getCommentsFromPostId(req)
    res.status(comments.code).json(comments)
    return
  }

  const error = CommentsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default handler
