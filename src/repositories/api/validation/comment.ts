import { CreateComment } from '@/models/entities/api/comment'
import { NextApiRequest } from 'next'
import CommentDB from '../comment_db'
import PostDB from '../post_db'
import UserDB from '../user_db'
import CommonValidation from './common'

export default class CommentValidation {
  /**
   * Validate postId query
   * @param req `NextApiRequest`
   * @returns `number | Error`
   */
  static postId = (req: NextApiRequest): number | Error => {
    const { postId } = req.query
    if (!CommonValidation.isNumber(postId)) {
      return new Error('Invalid postId')
    }
    return Number(postId)
  }

  /**
   * Validate id query
   * @param req `NextApiRequest`
   * @returns `number | Error`
   */
  static deleteId = (req: NextApiRequest): number | Error => {
    const { id } = req.query
    if (!CommonValidation.isNumber(id)) {
      return new Error('Invalid id')
    }
    return Number(id)
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

    const comment = {
      ...(req.body as CreateComment),
      postId,
    }
    if (!comment.content) {
      return new Error('Invalid content')
    }
    if (!comment.author) {
      return new Error('Invalid author')
    }
    if (!comment.author.name) {
      return new Error('Invalid author name')
    }
    if (!comment.author.email) {
      return new Error('Invalid author email')
    }

    if (comment.authorId) {
      const user = await UserDB.getUserById(comment.authorId)
      if (!user || user instanceof Error) {
        return new Error('Invalid author id')
      }
      return comment
    }

    const isPostCommentable = await PostDB.isPostCommentable(postId)
    if (!isPostCommentable || isPostCommentable instanceof Error) {
      return new Error('Post is not commentable')
    }

    if (comment.parentId) {
      const isValidReply = await CommentDB.isValidReplyComment(
        comment.postId,
        comment.parentId
      )
      if (!isValidReply || isValidReply instanceof Error) {
        return new Error('Invalid reply comment')
      }
    }

    return comment
  }
}
