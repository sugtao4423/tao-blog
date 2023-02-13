import { CommonResponse } from '@/models/entities/api/common_response'
import { GetSpecificPost } from '@/models/entities/api/post'
import PostsService from '@/services/api/posts'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetSpecificPost | CommonResponse<'OK' | 'NG'>>
) => {
  if (req.method === 'GET') {
    const post = await PostsService.getPostById(req)
    res.status(post.code).json(post)
    return
  }

  const error = PostsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default handler
