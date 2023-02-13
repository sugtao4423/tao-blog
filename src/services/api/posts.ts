import { CreatedPost, PaginationGetPosts } from '@/models/entities/api/post'
import DBPagination from '@/repositories/api/db_pagination'
import PostDB from '@/repositories/api/post_db'
import PostValidation from '@/repositories/api/validation/post'
import { NextApiRequest } from 'next'

const error = (code: number, message: string): CreatedPost => ({
  code,
  error: true,
  message,
  data: 'NG',
})

export default class PostsService extends DBPagination {
  static MethodNotAllowedError = error(405, 'Method Not Allowed')

  /**
   * Create post
   * @param req `NextApiRequest`
   * @returns `CreatedPost`
   */
  static createPost = async (req: NextApiRequest): Promise<CreatedPost> => {
    const post = await PostValidation.createPost(req)
    if (post instanceof Error) {
      return error(400, post.message)
    }

    const createdCount = await PostDB.createPost(post)
    if (createdCount instanceof Error) {
      return error(500, createdCount.message)
    }

    const isCreated = createdCount > 0
    return {
      code: isCreated ? 201 : 409,
      data: isCreated ? 'OK' : 'NG',
    }
  }

  /**
   * Get posts with pagination
   * @returns `PaginationGetPosts`
   */
  getPosts = async (): Promise<PaginationGetPosts> => {
    const posts = await PostDB.getPosts(this.getPagination())
    if (posts instanceof Error) {
      return {
        ...error(500, posts.message),
        pagination: this.getApiPagination(),
        data: [],
      }
    }

    return {
      code: 200,
      pagination: this.getApiPagination(),
      data: posts,
    }
  }
}
