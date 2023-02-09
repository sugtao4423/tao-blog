import { LoginUser } from '@/models/entities/database'
import db from './database'
import DBTime from './db_time'
import DatabaseSelectError from './errors/db_select'

export default class UserDB {
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
        createdAt: DBTime.dbDatetime2Unixtime(user.createdAt),
      }
    } catch (e) {
      return new DatabaseSelectError(e, 'Select user error')
    }
  }
}
