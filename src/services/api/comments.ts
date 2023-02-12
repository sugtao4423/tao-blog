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
    const createdCount = await CommentDB.createComment({
      postId: comment.postId,
      authorIp,
      authorUserAgent,
      comment,
    })
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

    const deletedCount = await CommentDB.deleteComment(id)
    if (deletedCount instanceof Error) {
      return error(500, deletedCount.message)
    }

    const isDeleted = deletedCount > 0
    return {
      code: isDeleted ? 200 : 409,
      data: isDeleted ? 'OK' : 'NG',
    }
  }
}
