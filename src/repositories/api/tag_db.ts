import db from './database'
import DBTime from './db_time'
import DatabaseSelectError from './errors/db_select'

export default class TagDB {
  static createTag = async (name: string): Promise<null | Error> => {
    try {
      await db
        .insertInto('tags')
        .values({
          name,
          createdAt: DBTime.nowDbDatetime(),
        })
        .executeTakeFirstOrThrow()
      return null
    } catch (e) {
      return new DatabaseSelectError(e, 'Create tag error')
    }
  }
}
