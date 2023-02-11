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

  static createComment = async ({
    postId,
    authorIp,
    authorUserAgent,
    comment,
  }: CreateType): Promise<null | Error> => {
    try {
      await db
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
      return null
    } catch (e) {
      return new DatabaseInsertError(e, 'Create comment error')
    }
  }

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
}
