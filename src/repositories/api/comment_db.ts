import { CreateComment } from '@/models/entities/api/comment'
import db from './database'
import DBTime from './db_time'
import DatabaseInsertError from './errors/db_insert'

type CreateType = {
  postId: number
  authorIp: string
  authorUserAgent: string
  comment: CreateComment
}

export default class CommentDB {
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
}
