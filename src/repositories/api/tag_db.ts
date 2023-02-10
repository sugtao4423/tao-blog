import { GetTag } from '@/models/entities/api/tag'
import { DatabasePagination, DatabaseTables } from '@/models/entities/database'
import { Selection } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'
import db from './database'
import DBTime from './db_time'
import DatabaseSelectError from './errors/db_select'

type RowType = Selection<From<DatabaseTables, 'tags'>, 'tags', keyof GetTag>

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

  private static convertRow = (row: RowType): GetTag => ({
    id: row.id,
    name: row.name,
    createdAt: DBTime.dbDatetime2Unixtime(row.createdAt),
  })

  static getTags = async ({
    offset,
    limit,
  }: DatabasePagination): Promise<GetTag[] | Error> => {
    try {
      const tags = await db
        .selectFrom('tags')
        .selectAll()
        .orderBy('createdAt', 'desc')
        .offset(offset)
        .limit(limit)
        .execute()

      return tags.map(TagDB.convertRow)
    } catch (e) {
      return new DatabaseSelectError(e, 'Get tags error')
    }
  }
}
