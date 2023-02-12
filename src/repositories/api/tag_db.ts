import { CreateTag, GetTag, UpdateTag } from '@/models/entities/api/tag'
import {
  DatabasePagination,
  DatabaseTables,
  TagTable,
} from '@/models/entities/database'
import { Selection, sql } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'
import db from './database'
import DBTime from './db_time'
import DatabaseSelectError from './errors/db_select'
import DatabaseUpdateError from './errors/db_update'

type RowType = Selection<From<DatabaseTables, 'tags'>, 'tags', keyof TagTable>

export default class TagDB {
  /**
   * Create tag in database
   * @param tag Tag to create
   * @returns Created tag count if success, `Error` if failed
   */
  static createTag = async (tag: CreateTag): Promise<bigint | Error> => {
    try {
      const result = await db
        .insertInto('tags')
        .ignore()
        .values({
          name: tag.name,
          createdAt: DBTime.nowDbDatetime(),
        })
        .executeTakeFirstOrThrow()

      return result.numInsertedOrUpdatedRows ?? BigInt(0)
    } catch (e) {
      return new DatabaseSelectError(e, 'Create tag error')
    }
  }

  /**
   * Convert db row to `GetTag`
   * @param row Row to convert
   * @returns `GetTag`
   */
  private static convertRow = (row: RowType): GetTag => ({
    id: row.id,
    name: row.name,
    createdAt: DBTime.dbDatetime2Unixtime(row.createdAt),
  })

  /**
   * Get tags from database
   * @param pagination if null, get all tags
   * @returns `GetTag[]` if success, `Error` if failed
   */
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

  /**
   * Update tag in database by id
   * @param id Target tag id
   * @param tag Tag to update
   * @returns Updated tag count if success, `Error` if failed
   */
  static updateTag = async (
    id: number,
    tag: UpdateTag
  ): Promise<bigint | Error> => {
    try {
      const result = await db
        .updateTable('tags')
        .set({
          name: tag.name,
        })
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return result.numUpdatedRows
    } catch (e) {
      return new DatabaseUpdateError(e, 'Update tag error')
    }
  }

  /**
   * Delete tag in database by id
   * @param id Target tag id
   * @returns Deleted tag count if success, `Error` if failed
   */
  static deleteTag = async (id: number): Promise<bigint | Error> => {
    try {
      const result = await db
        .deleteFrom('tags')
        .where('id', '=', id)
        .whereNotExists((qb) =>
          qb
            .selectFrom('posts')
            .select('id')
            .where(sql`JSON_CONTAINS(tagIds, ${id})`)
        )
        .executeTakeFirstOrThrow()

      return result.numDeletedRows
    } catch (e) {
      return new DatabaseUpdateError(e, 'Delete tag error')
    }
  }
}
