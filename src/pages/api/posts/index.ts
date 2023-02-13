import { CreatedPost } from '@/models/entities/api/post'
import { withModifyAuth } from '@/services/api/api_handler'
import PostsService from '@/services/api/posts'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreatedPost>
) => {
  if (req.method === 'POST') {
    const created = await PostsService.createPost(req)
    res.status(created.code).json(created)
    return
  }

  const error = PostsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default withModifyAuth(handler)
