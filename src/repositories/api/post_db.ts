import { CreatePost } from '@/models/entities/api/post'
import db from './database'
import DBTime from './db_time'
import DatabaseInsertError from './errors/db_insert'
import DatabaseSelectError from './errors/db_select'

export default class PostDB {
  /**
   * Check if post is commentable
   * @param postId Target post id
   * @returns commentable boolean if success, `Error` if failed
   */
  static isPostCommentable = async (
    postId: number
  ): Promise<boolean | Error> => {
    try {
      const post = await db
        .selectFrom('posts')
        .select([(b) => b.fn.count('id').as('count')])
        .where('id', '=', postId)
        .where('commentable', '=', true)
        .executeTakeFirstOrThrow()

      return post.count > 0
    } catch (e) {
      return new DatabaseSelectError(e, 'Get post error')
    }
  }

  /**
   * Create post in database
   * @param post Post to create
   * @returns Created post count if success, `Error` if failed
   */
  static createPost = async (post: CreatePost): Promise<bigint | Error> => {
    try {
      const result = await db
        .insertInto('posts')
        .values({
          title: post.title,
          content: post.content,
          abstract: post.abstract,
          thumbnailUrl: post.thumbnailUrl,
          authorId: post.authorId,
          tagIds: JSON.stringify(post.tagIds),
          status: post.status,
          commentable: post.commentable,
          createdAt: DBTime.nowDbDatetime(),
          updatedAt: DBTime.nowDbDatetime(),
        })
        .executeTakeFirstOrThrow()

      return result.numInsertedOrUpdatedRows ?? BigInt(0)
    } catch (e) {
      return new DatabaseInsertError(e, 'Create post error')
    }
  }
}
