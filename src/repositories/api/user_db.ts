import { GetUser } from '@/models/entities/api/user'
import { LoginUser } from '@/models/entities/database'
import db from './database'
import DBTime from './db_time'
import DatabaseSelectError from './errors/db_select'
import GravatarUrl from './gravatar'

export default class UserDB {
  /**
   * Get user by email from database
   * @param email Target email
   * @returns `LoginUser` if success, `null` if not found, `Error` if failed
   */
  static getUserByEmail = async (
    email: string
  ): Promise<LoginUser | null | Error> => {
    try {
      const user = await db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst()
      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        hashedPassword: user.password,
        url: user.url,
        createdAt: DBTime.toUnix(user.createdAt),
      }
    } catch (e) {
      return new DatabaseSelectError(e, 'Select user error')
    }
  }

  /**
   * Get user by id from database
   * @param id Target id
   * @returns `GetUser` if success, `null` if not found, `Error` if failed
   */
  static getUserById = async (id: number): Promise<GetUser | null | Error> => {
    try {
      const user = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        gravatarUrl: GravatarUrl(user.email),
        url: user.url,
        createdAt: DBTime.toUnix(user.createdAt),
      }
    } catch (e) {
      return new DatabaseSelectError(e, 'Select user error')
    }
  }
}
