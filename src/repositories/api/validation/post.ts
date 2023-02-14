import { CreatePost, UpdatePost } from '@/models/entities/api/post'
import { NextApiRequest } from 'next'
import TagDB from '../tag_db'
import CommonValidation from './common'

export default class PostValidation {
  /**
   * Validate id query
   * @param req `NextApiRequest`
   * @returns `number | Error`
   */
  static id = (req: NextApiRequest): number | Error => {
    const { id } = req.query
    if (!CommonValidation.isNumber(id)) {
      return new Error('Invalid id')
    }
    return Number(id)
  }

  /**
   * Is valid post data
   * @param post `Partial<CreatePost>`
   * @returns null if valid, otherwise `Error`
   */
  static validPost = async (
    post: Partial<CreatePost>,
    requireAll: boolean
  ): Promise<null | Error> => {
    const requiredKeys: readonly (keyof CreatePost)[] = [
      'title',
      'content',
      'abstract',
      'authorId',
      'tagIds',
      'status',
    ]
    for (let i = 0; i < requiredKeys.length; i += 1) {
      const key = requiredKeys[i]
      if ((requireAll || key in post) && !post[key]) {
        return new Error(`Invalid ${key}`)
      }
    }

    const statuses: readonly CreatePost['status'][] = [
      'publish',
      'draft',
      'hidden',
    ]
    if (
      (requireAll || 'status' in post) &&
      (!post.status || !statuses.includes(post.status))
    ) {
      return new Error('Invalid status')
    }

    if (
      (requireAll || 'commentable' in post) &&
      typeof post.commentable !== 'boolean'
    ) {
      return new Error('Invalid commentable')
    }

    if ((requireAll || 'tagIds' in post) && post.tagIds) {
      const tagCountInDB = await TagDB.getTagsByIds(post.tagIds)
      if (tagCountInDB instanceof Error) {
        return tagCountInDB
      }
      if (tagCountInDB.length !== post.tagIds.length) {
        return new Error('A non-existent tag ID is set')
      }
    }

    return null
  }

  /**
   * Validate `CreatePost`
   * @param req `NextApiRequest`
   * @returns `CreatePost | Error`
   */
  static createPost = async (
    req: NextApiRequest
  ): Promise<CreatePost | Error> => {
    const post = req.body as CreatePost
    const valid = await PostValidation.validPost(post, true)
    if (valid instanceof Error) return valid

    return post
  }

  /**
   * Validate `UpdatePost`
   * @param req `NextApiRequest`
   * @returns `({ id: number } & UpdatePost) | Error`
   */
  static updatePost = async (
    req: NextApiRequest
  ): Promise<({ id: number } & UpdatePost) | Error> => {
    const id = PostValidation.id(req)
    if (id instanceof Error) return id

    const post = req.body as UpdatePost
    if (Object.keys(post).length <= 0) {
      return new Error('No update data')
    }

    const valid = await PostValidation.validPost(post, false)
    if (valid instanceof Error) return valid

    return { id, ...post }
  }
}
