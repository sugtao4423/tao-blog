import db from './database'
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
}
