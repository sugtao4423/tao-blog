import { CreatedPost } from '@/models/entities/api/post'
import PostDB from '@/repositories/api/post_db'
import PostValidation from '@/repositories/api/validation/post'
import { NextApiRequest } from 'next'

const error = (code: number, message: string): CreatedPost => ({
  code,
  error: true,
  message,
  data: 'NG',
})

export default class PostsService {
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
}
