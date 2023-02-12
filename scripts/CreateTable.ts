import { sql } from 'kysely'
import { db, question } from './common'

const CreateUserSQL = `
  CREATE USER '{USER_NAME}'@'%' IDENTIFIED BY '{USER_PASSWD}';
  CREATE DATABASE \`{DB_NAME}\`;
  GRANT ALL PRIVILEGES ON \`{DB_NAME}\`.* TO '{USER_NAME}'@'%' IDENTIFIED BY '{USER_PASSWD}';
`

const createTables = async () => {
  // users
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('url', 'text')
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .execute()

  // tags
  await db.schema
    .createTable('tags')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .execute()

  // comments
  await db.schema
    .createTable('comments')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('parentId', 'integer')
    .addColumn('postId', 'integer', (col) => col.notNull())
    .addColumn('authorId', 'integer')
    .addColumn('authorName', 'text')
    .addColumn('authorEmail', 'text')
    .addColumn('authorUrl', 'text')
    .addColumn('authorIp', 'text')
    .addColumn('authorUserAgent', 'text')
    .addColumn('content', sql`LONGTEXT`, (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addForeignKeyConstraint(
      'commentAuthorForeignKey',
      ['authorId'],
      'users',
      ['id'],
      (cb) => cb.onDelete('restrict').onUpdate('cascade')
    )
    .execute()

  // posts
  await db.schema
    .createTable('posts')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('content', sql`LONGTEXT`, (col) => col.notNull())
    .addColumn('abstract', 'text', (col) => col.notNull())
    .addColumn('thumbnailUrl', 'text')
    .addColumn('authorId', 'integer', (col) => col.notNull())
    .addColumn('tagIds', 'json', (col) => col.notNull().defaultTo('[]'))
    .addColumn('status', sql`ENUM('publish', 'draft', 'hidden')`, (col) =>
      col.notNull()
    )
    .addColumn('commentable', 'boolean', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('updatedAt', 'datetime', (col) => col.notNull())
    .addForeignKeyConstraint(
      'postAuthorForeignKey',
      ['authorId'],
      'users',
      ['id'],
      (cb) => cb.onDelete('restrict').onUpdate('cascade')
    )
    .execute()
}

;(async () => {
  const showCreateUser = await question('Show create user sentense? (Y/n): ')
  if (showCreateUser === 'Y' || showCreateUser === 'y') {
    console.log(CreateUserSQL)
  }

  const createTable = await question('Create table? (Y/n): ')
  if (createTable === 'Y' || createTable === 'y') {
    console.log('')
    await createTables()
    console.log('\nDone.')
  }
  process.exit(0)
})()
