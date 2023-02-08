import { DatabaseTables } from '@/models/entities/database'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

/**
 * Get database connection
 *
 * MUST BE GLOBAL
 */
const db = new Kysely<DatabaseTables>({
  dialect: new MysqlDialect({
    pool: createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      timezone: 'Z',
    }),
  }),
})

export default db
