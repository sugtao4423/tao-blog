import { CreatePost } from '@/models/entities/api/post'
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
   * Validate `CreatePost`
   * @param req `NextApiRequest`
   * @returns `CreatePost | Error`
   */
  static createPost = async (
    req: NextApiRequest
  ): Promise<CreatePost | Error> => {
    const post = req.body as CreatePost

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
      if (!post[key]) {
        return new Error(`Invalid ${key}`)
      }
    }

    const statuses: readonly CreatePost['status'][] = [
      'publish',
      'draft',
      'hidden',
    ]
    if (!statuses.includes(post.status)) {
      return new Error('Invalid status')
    }

    if (typeof post.commentable !== 'boolean') {
      return new Error('Invalid commentable')
    }

    const tagCountInDB = await TagDB.getTagsByIds(post.tagIds)
    if (tagCountInDB instanceof Error) {
      return tagCountInDB
    }
    if (tagCountInDB.length !== post.tagIds.length) {
      return new Error('A non-existent tag ID is set')
    }

    return post
  }
}
