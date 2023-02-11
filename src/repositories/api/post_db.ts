import db from './database'
import DatabaseSelectError from './errors/db_select'

export default class PostDB {
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
