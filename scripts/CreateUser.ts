import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { db, question } from './common'
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
