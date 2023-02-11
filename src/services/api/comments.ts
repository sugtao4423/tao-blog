import { CreatedComment, GetPostComments } from '@/models/entities/api/comment'
import CommentDB from '@/repositories/api/comment_db'
import CommentValidation from '@/repositories/api/validation/comment'
import { NextApiRequest } from 'next'
import { getClientIp } from 'request-ip'

const error = (code: number, message: string): CreatedComment => ({
  code,
  error: true,
  message,
  data: 'NG',
})

export default class CommentsService {
  static MethodNotAllowedError: CreatedComment = error(
    405,
    'Method Not Allowed'
  )

  static createComment = async (
    req: NextApiRequest
  ): Promise<CreatedComment> => {
    const comment = await CommentValidation.createComment(req)
    if (comment instanceof Error) {
      return error(400, comment.message)
    }

    const authorIp = getClientIp(req) ?? ''
    const authorUserAgent = req.headers['user-agent'] ?? ''
    const created = await CommentDB.createComment({
      postId: comment.postId,
      authorIp,
      authorUserAgent,
      comment,
    })
    if (created instanceof Error) {
      return error(500, created.message)
    }

    return {
      code: 201,
      data: 'OK',
    }
  }

  static getCommentsFromPostId = async (
    req: NextApiRequest
  ): Promise<GetPostComments> => {
    const postId = CommentValidation.postId(req)
    if (postId instanceof Error) {
      return {
        ...error(400, postId.message),
        data: [],
      }
    }

    const comments = await CommentDB.getCommentsFromPostId(postId)
    if (comments instanceof Error) {
      return {
        ...error(500, comments.message),
        data: [],
      }
    }

    return {
      code: 200,
      data: comments,
    }
  }
}
