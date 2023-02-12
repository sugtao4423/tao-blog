import {
  CreatedComment,
  DeletedComment,
  GetPostComments,
  PaginationGetComments,
} from '@/models/entities/api/comment'
import CommentDB from '@/repositories/api/comment_db'
import DBPagination from '@/repositories/api/db_pagination'
import CommentValidation from '@/repositories/api/validation/comment'
import { NextApiRequest } from 'next'
import { getClientIp } from 'request-ip'

const error = (code: number, message: string): CreatedComment => ({
  code,
  error: true,
  message,
  data: 'NG',
})

export default class CommentsService extends DBPagination {
  static MethodNotAllowedError: CreatedComment = error(
    405,
    'Method Not Allowed'
  )

  /**
   * Create comment to post or reply to comment
   * @param req `NextApiRequest`
   * @returns `CreatedComment`
   */
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

  /**
   * Get comments from post id
   * @param req `NextApiRequest`
   * @returns `GetPostComments`
   */
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

  /**
   * Get comments with pagination
   * @returns `PaginationGetComments`
   */
  getComments = async (): Promise<PaginationGetComments> => {
    const comments = await CommentDB.getComments(this.getPagination())
    if (comments instanceof Error) {
      return {
        ...error(500, comments.message),
        pagination: this.getApiPagination(),
        data: [],
      }
    }

    return {
      code: 200,
      pagination: this.getApiPagination(),
      data: comments,
    }
  }

  /**
   * Delete comment by id
   * @param req `NextApiRequest`
   * @returns `DeletedComment`
   */
  static deleteComment = async (
    req: NextApiRequest
  ): Promise<DeletedComment> => {
    const id = CommentValidation.deleteId(req)
    if (id instanceof Error) {
      return error(400, id.message)
    }

    const deleted = await CommentDB.deleteComment(id)
    if (deleted instanceof Error) {
      return error(500, deleted.message)
    }

    return {
      code: 200,
      data: 'OK',
    }
  }
}
