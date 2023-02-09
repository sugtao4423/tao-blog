import { DatabaseTables } from '@/models/entities/database'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import dotenv from 'dotenv'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import * as readline from 'readline'

dotenv.config()

const db = new Kysely<DatabaseTables>({
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

const question = async (ask: string): Promise<string> => {
  rl.setPrompt(ask)
  rl.prompt()

  return new Promise((resolve) => {
    rl.on('line', (userInput) => {
      resolve(userInput)
    })
  })
}

;(async () => {
  const userName = await question('User name: ')
  const userEmail = await question('User email: ')
  const userPasswd = await question('User password: ')

  const hashedPasswd = await bcrypt.hash(userPasswd, 10)

  dayjs.extend(utc)
  const createdAt = dayjs().utc().format('YYYY-MM-DD HH:mm:ss')

  console.log('')
  await db
    .insertInto('users')
    .values({
      name: userName,
      email: userEmail,
      password: hashedPasswd,
      createdAt,
    })
    .execute()
  console.log('\nDone.')

  process.exit(0)
})()
