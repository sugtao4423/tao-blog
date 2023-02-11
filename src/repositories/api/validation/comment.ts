import { CreateComment } from '@/models/entities/api/comment'
import { NextApiRequest } from 'next'
import UserDB from '../user_db'

export default class CommentValidation {
  /**
   * Validate postId query
   * @param req `NextApiRequest`
   * @returns `number | Error`
   */
  static postId = (req: NextApiRequest): number | Error => {
    const { postId } = req.query
    if (!postId || Array.isArray(postId) || Number.isNaN(Number(postId))) {
      return new Error('Invalid postId')
    }
    return Number(postId)
  }

  /**
   * Validate `CreateComment`
   * @param req `NextApiRequest`
   * @returns `({ postId: number } & CreateComment) | Error`
   */
  static createComment = async (
    req: NextApiRequest
  ): Promise<({ postId: number } & CreateComment) | Error> => {
    const postId = CommentValidation.postId(req)
    if (postId instanceof Error) {
      return postId
    }

    const comment = req.body as CreateComment
    if (!comment.content) {
      return new Error('Invalid content')
    }

    if (comment.authorId) {
      const user = await UserDB.getUserById(comment.authorId)
      if (!user || user instanceof Error) {
        return new Error('Invalid author id')
      }
      return { postId: Number(postId), ...comment }
    }

    // TODO: check exists post

    if (!comment.author) {
      return new Error('Invalid author')
    }
    if (!comment.author.name) {
      return new Error('Invalid author name')
    }
    if (!comment.author.email) {
      return new Error('Invalid author email')
    }

    return { postId: Number(postId), ...comment }
  }
}
