import { CreatePost, GetPost, UpdatePost } from '@/models/entities/api/post'
import { GetTag } from '@/models/entities/api/tag'
import { DatabasePagination, DatabaseTables } from '@/models/entities/database'
import { Selection } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'
import CommentDB from './comment_db'
import db from './database'
import DBTime from './db_time'
import DatabaseDeleteError from './errors/db_delete'
import DatabaseInsertError from './errors/db_insert'
import DatabaseSelectError from './errors/db_select'
import DatabaseUpdateError from './errors/db_update'
import TagDB from './tag_db'

const selectTarget = [
  'posts.id as postId',
  'posts.title as postTitle',
  'posts.content as postContent',
  'posts.abstract as postAbstract',
  'posts.thumbnailUrl as postThumbnailUrl',
  'posts.tagIds as postTagIds',
  'posts.status as postStatus',
  'posts.commentable as postCommentable',
  'posts.createdAt as postCreatedAt',
  'posts.updatedAt as postUpdatedAt',
  'users.id as authorId',
  'users.name as authorName',
  'users.url as authorUrl',
  'users.createdAt as authorCreatedAt',
] as const

type RowType = Selection<
  From<DatabaseTables, 'posts'>,
  'posts' | 'users',
  (typeof selectTarget)[number]
>

export default class PostDB {
  /**
   * Check if post is commentable
   * @param postId Target post id
   * @returns commentable boolean if success, `Error` if failed
   */
  static isPostCommentable = async (
    postId: number
  ): Promise<boolean | Error> => {
    try {
      const post = await db
        .selectFrom('posts')
        .select([(b) => b.fn.count('id').as('count')])
        .where('id', '=', postId)
        .where('commentable', '=', true)
        .executeTakeFirstOrThrow()

      return post.count > 0
    } catch (e) {
      return new DatabaseSelectError(e, 'Get post error')
    }
  }

  /**
   * Create post in database
   * @param post Post to create
   * @returns Created post count if success, `Error` if failed
   */
  static createPost = async (post: CreatePost): Promise<bigint | Error> => {
    try {
      const result = await db
        .insertInto('posts')
        .values({
          title: post.title,
          content: post.content,
          abstract: post.abstract,
          thumbnailUrl: post.thumbnailUrl,
          authorId: post.authorId,
          tagIds: JSON.stringify(post.tagIds),
          status: post.status,
          commentable: post.commentable,
          createdAt: DBTime.now(),
          updatedAt: DBTime.now(),
        })
        .executeTakeFirstOrThrow()

      return result.numInsertedOrUpdatedRows ?? BigInt(0)
    } catch (e) {
      return new DatabaseInsertError(e, 'Create post error')
    }
  }

  /**
   * Convert rows to `GetPost[]`
   * @param rows Rows to convert
   * @throws `Error` if get tag failed
   * @returns `GetPost[]`
   */
  private static convertRows = async (rows: RowType[]): Promise<GetPost[]> => {
    const inPostTagIds = rows.flatMap(
      (row) => JSON.parse(row.postTagIds) as number[]
    )
    const uniqueTagIds = Array.from(new Set(inPostTagIds))
    const tags = await TagDB.getTagsByIds(uniqueTagIds)
    if (tags instanceof Error) throw tags

    const findTags = (postTagIds: string): GetTag[] =>
      (JSON.parse(postTagIds) as number[]).map((id) => {
        const tag = tags.find((t) => t.id === id)
        if (!tag) throw new Error('Tag not found')
        return tag
      })

    return rows.map((row) => ({
      id: row.postId,
      title: row.postTitle,
      content: row.postContent,
      abstract: row.postAbstract,
      thumbnailUrl: row.postThumbnailUrl,
      author: {
        id: row.authorId,
        name: row.authorName,
        url: row.authorUrl,
        createdAt: DBTime.toUnix(row.authorCreatedAt),
      },
      tags: findTags(row.postTagIds),
      status: row.postStatus,
      commentable: Boolean(row.postCommentable),
      createdAt: DBTime.toUnix(row.postCreatedAt),
      updatedAt: DBTime.toUnix(row.postUpdatedAt),
    }))
  }

  /**
   * Get posts from database
   * @param pagination if null, get all posts
   * @returns `GetPost[]` if success, `Error` if failed
   */
  static getPosts = async (
    pagination: DatabasePagination | null
  ): Promise<GetPost[] | Error> => {
    try {
      // Not supported `LEFT JOIN tags ON JSON_SEARCH(...)` in kysely.
      // Raw query is too long, so call 2 queries.
      let query = db
        .selectFrom('posts')
        .innerJoin('users', 'posts.authorId', 'users.id')
        .select(selectTarget)
        .orderBy('posts.createdAt', 'desc')
      if (pagination) {
        query = query.offset(pagination.offset).limit(pagination.limit)
      }
      const posts = await query.execute()

      return await PostDB.convertRows(posts)
    } catch (e) {
      return new DatabaseSelectError(e, 'Get post error')
    }
  }

  /**
   * Get post by id from database
   * @param id Post id
   * @returns `GetPost` if success, `Error` if failed
   */
  static getPostById = async (id: number): Promise<GetPost | Error> => {
    try {
      const post = await db
        .selectFrom('posts')
        .innerJoin('users', 'posts.authorId', 'users.id')
        .select(selectTarget)
        .where('posts.id', '=', id)
        .executeTakeFirstOrThrow()

      return (await PostDB.convertRows([post]))[0]
    } catch (e) {
      return new DatabaseSelectError(e, 'Get post error')
    }
  }

  /**
   * Update post in database by id
   * @param id Target post id
   * @param post Post to update
   * @returns Updated post count if success, `Error` if failed
   */
  static updatePost = async (
    id: number,
    post: UpdatePost
  ): Promise<bigint | Error> => {
    try {
      const result = await db
        .updateTable('posts')
        .set({
          title: post.title,
          content: post.content,
          abstract: post.abstract,
          thumbnailUrl: post.thumbnailUrl,
          authorId: post.authorId,
          tagIds: JSON.stringify(post.tagIds),
          status: post.status,
          commentable: post.commentable,
          updatedAt: DBTime.now(),
        })
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return result.numUpdatedRows
    } catch (e) {
      return new DatabaseUpdateError(e, 'Update post error')
    }
  }

  /**
   * Delete post in database by id
   * @param id Target post id
   * @returns Deleted post count if success, `Error` if failed
   */
  static deletePost = async (id: number): Promise<bigint | Error> => {
    const deleteCommentCount = await CommentDB.deleteCommentsByPostId(id)
    if (deleteCommentCount instanceof Error) {
      return deleteCommentCount
    }

    try {
      const result = await db
        .deleteFrom('posts')
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return result.numDeletedRows
    } catch (e) {
      return new DatabaseDeleteError(e, 'Delete post error')
    }
  }
}
