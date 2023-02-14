import { CreateComment, GetComment } from '@/models/entities/api/comment'
import {
  DatabasePagination,
  DatabaseTables,
  UserTable,
} from '@/models/entities/database'
import { LeftJoinedDB, Selection } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'
import db from './database'
import DBTime from './db_time'
import DatabaseDeleteError from './errors/db_delete'
import DatabaseInsertError from './errors/db_insert'
import DatabaseSelectError from './errors/db_select'

type CreateType = {
  postId: number
  authorIp: string
  authorUserAgent: string
  comment: CreateComment
}

const selectTarget = [
  'comments.id as commentId',
  'comments.parentId as commentParentId',
  'comments.postId as commentPostId',
  'comments.authorId as commentAuthorId',
  'comments.authorName as commentAuthorName',
  'comments.authorUrl as commentAuthorUrl',
  'users.name as userName',
  'users.email as userEmail',
  'users.url as userUrl',
  'comments.content as commentContent',
  'comments.createdAt as commentCreatedAt',
] as const

type RowType = Selection<
  LeftJoinedDB<From<DatabaseTables, 'comments'>, 'users', UserTable>,
  'comments' | 'users',
  (typeof selectTarget)[number]
>

export default class CommentDB {
  /**
   * Is comment valid to reply
   * @param postId To comment post id
   * @param parentId To comment parent comment id
   */
  static isValidReplyComment = async (
    postId: number,
    parentId: number
  ): Promise<boolean | Error> => {
    try {
      const validComment = await db
        .selectFrom('comments')
        .select([(b) => b.fn.count('id').as('count')])
        .where('id', '=', parentId)
        .where('parentId', 'is', null)
        .where('postId', '=', postId)
        .executeTakeFirstOrThrow()

      return validComment.count > 0
    } catch (e) {
      return new DatabaseSelectError(e, 'Get comment error')
    }
  }

  /**
   * Create comment in database
   * @param param Create comment parameters
   * @returns Created comment count if success, error if failed
   */
  static createComment = async ({
    postId,
    authorIp,
    authorUserAgent,
    comment,
  }: CreateType): Promise<bigint | Error> => {
    try {
      const result = await db
        .insertInto('comments')
        .values({
          parentId: comment.parentId,
          postId,
          authorId: comment.authorId,
          authorName: comment.author?.name,
          authorEmail: comment.author?.email,
          authorUrl: comment.author?.url,
          authorIp,
          authorUserAgent,
          content: comment.content,
          createdAt: DBTime.nowDbDatetime(),
        })
        .executeTakeFirstOrThrow()

      return result.numInsertedOrUpdatedRows ?? BigInt(0)
    } catch (e) {
      return new DatabaseInsertError(e, 'Create comment error')
    }
  }

  /**
   * Convert row to `GetComment`
   * @param row Row to convert
   * @returns `GetComment`
   */
  private static convertRow = (row: RowType): GetComment => ({
    id: row.commentId,
    parentId: row.commentParentId,
    postId: row.commentPostId,
    author: {
      id: row.commentAuthorId,
      name: row.commentAuthorName ?? row.userName,
      url: row.commentAuthorUrl ?? row.userUrl,
    },
    content: row.commentContent,
    createdAt: DBTime.dbDatetime2Unixtime(row.commentCreatedAt),
  })

  /**
   * Get comments by post id from database
   * @param postId Target post id
   * @returns `GetComment[]` if success, `Error` if failed
   */
  static getCommentsFromPostId = async (
    postId: number
  ): Promise<GetComment[] | Error> => {
    try {
      const comments = await db
        .selectFrom('comments')
        .leftJoin('users', 'comments.authorId', 'users.id')
        .select(selectTarget)
        .where('postId', '=', postId)
        .orderBy('comments.createdAt', 'desc')
        .execute()

      return comments.map(CommentDB.convertRow)
    } catch (e) {
      return new DatabaseSelectError(e, 'Get comments error')
    }
  }

  /**
   * Get comments from database
   * @param pagination if null, get all comments
   * @returns `GetComment[]` if success, `Error` if failed
   */
  static getComments = async (
    pagination: DatabasePagination | null
  ): Promise<GetComment[] | Error> => {
    try {
      let query = db
        .selectFrom('comments')
        .leftJoin('users', 'comments.authorId', 'users.id')
        .select(selectTarget)
        .orderBy('comments.createdAt', 'desc')
      if (pagination) {
        query = query.offset(pagination.offset).limit(pagination.limit)
      }
      const comments = await query.execute()

      return comments.map(CommentDB.convertRow)
    } catch (e) {
      return new DatabaseSelectError(e, 'Get comments error')
    }
  }

  /**
   * Delete comment from database
   * @param id Target comment id
   * @returns Deleted comment count if success, `Error` if failed
   */
  static deleteComment = async (id: number): Promise<bigint | Error> => {
    try {
      const result = await db
        .deleteFrom('comments')
        .where('id', '=', id)
        .whereNotExists((qb) =>
          qb.selectFrom('comments').select('id').where('parentId', '=', id)
        )
        .executeTakeFirstOrThrow()

      return result.numDeletedRows
    } catch (e) {
      return new DatabaseDeleteError(e, 'Delete comment error')
    }
  }

  /**
   * Delete comments by postId from database
   * @param postId Target post id
   * @returns Deleted comment count if success, `Error` if failed
   */
  static deleteCommentsByPostId = async (
    postId: number
  ): Promise<bigint | Error> => {
    try {
      const result = await db
        .deleteFrom('comments')
        .where('postId', '=', postId)
        .executeTakeFirstOrThrow()

      return result.numDeletedRows
    } catch (e) {
      return new DatabaseDeleteError(e, 'Delete comments error')
    }
  }
}
