import {
  DeletedPost,
  GetSpecificPost,
  UpdatedPost,
} from '@/models/entities/api/post'
import { withModifyAuth } from '@/services/api/api_handler'
import PostsService from '@/services/api/posts'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetSpecificPost | UpdatedPost | DeletedPost>
) => {
  if (req.method === 'GET') {
    const post = await PostsService.getPostById(req)
    res.status(post.code).json(post)
    return
  }
  if (req.method === 'PUT') {
    const post = await PostsService.updatePost(req)
    res.status(post.code).json(post)
    return
  }
  if (req.method === 'DELETE') {
    const post = await PostsService.deletePost(req)
    res.status(post.code).json(post)
    return
  }

  const error = PostsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default withModifyAuth(handler)
