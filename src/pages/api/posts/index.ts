import { CreatedPost, PaginationGetPosts } from '@/models/entities/api/post'
import { withModifyAuth } from '@/services/api/api_handler'
import { parsePagination } from '@/services/api/pagination'
import PostsService from '@/services/api/posts'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreatedPost | PaginationGetPosts>
) => {
  if (req.method === 'POST') {
    const created = await PostsService.createPost(req)
    res.status(created.code).json(created)
    return
  }
  if (req.method === 'GET') {
    const pagination = parsePagination(req)
    const posts = await new PostsService(pagination).getPosts()
    res.status(posts.code).json(posts)
    return
  }

  const error = PostsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default withModifyAuth(handler)
