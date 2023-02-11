import { CreateTag, GetTag, UpdateTag } from '@/models/entities/api/tag'
import {
  DatabasePagination,
  DatabaseTables,
  TagTable,
} from '@/models/entities/database'
import { Selection } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'
import db from './database'
import DBTime from './db_time'
import DatabaseSelectError from './errors/db_select'
import DatabaseUpdateError from './errors/db_update'

type RowType = Selection<From<DatabaseTables, 'tags'>, 'tags', keyof TagTable>

export default class TagDB {
  static createTag = async (tag: CreateTag): Promise<null | Error> => {
    try {
      await db
        .insertInto('tags')
        .values({
          name: tag.name,
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

  static getTags = async (
    pagination: DatabasePagination | null
  ): Promise<GetTag[] | Error> => {
    try {
      let query = db.selectFrom('tags').selectAll().orderBy('createdAt', 'desc')
      if (pagination) {
        query = query.offset(pagination.offset).limit(pagination.limit)
      }
      const tags = await query.execute()

      return tags.map(TagDB.convertRow)
    } catch (e) {
      return new DatabaseSelectError(e, 'Get tags error')
    }
  }

  static updateTag = async (
    id: number,
    tag: UpdateTag
  ): Promise<null | Error> => {
    try {
      await db
        .updateTable('tags')
        .set({
          name: tag.name,
        })
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
      return null
    } catch (e) {
      return new DatabaseUpdateError(e, 'Update tag error')
    }
  }
}
