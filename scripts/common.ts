import { DatabaseTables } from '@/models/entities/database'
import dotenv from 'dotenv'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import * as readline from 'readline'

dotenv.config()

export const db = new Kysely<DatabaseTables>({
  log: ['error', 'query'],
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

export const question = async (ask: string): Promise<string> => {
  rl.setPrompt(ask)
  rl.prompt()

  return new Promise((resolve) => {
    rl.on('line', (userInput) => {
      resolve(userInput)
    })
  })
}
