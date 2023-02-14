import {
  CreatedPost,
  GetSpecificPost,
  PaginationGetPosts,
  UpdatedPost,
} from '@/models/entities/api/post'
import DBPagination from '@/repositories/api/db_pagination'
import PostDB from '@/repositories/api/post_db'
import PostValidation from '@/repositories/api/validation/post'
import { NextApiRequest } from 'next'

const error = (code: number, message: string): CreatedPost => ({
  code,
  error: true,
  message,
  data: 'NG',
})

export default class PostsService extends DBPagination {
  static MethodNotAllowedError = error(405, 'Method Not Allowed')

  /**
   * Create post
   * @param req `NextApiRequest`
   * @returns `CreatedPost`
   */
  static createPost = async (req: NextApiRequest): Promise<CreatedPost> => {
    const post = await PostValidation.createPost(req)
    if (post instanceof Error) {
      return error(400, post.message)
    }

    const createdCount = await PostDB.createPost(post)
    if (createdCount instanceof Error) {
      return error(500, createdCount.message)
    }

    const isCreated = createdCount > 0
    return {
      code: isCreated ? 201 : 409,
      data: isCreated ? 'OK' : 'NG',
    }
  }

  /**
   * Get posts with pagination
   * @returns `PaginationGetPosts`
   */
  getPosts = async (): Promise<PaginationGetPosts> => {
    const posts = await PostDB.getPosts(this.getPagination())
    if (posts instanceof Error) {
      return {
        ...error(500, posts.message),
        pagination: this.getApiPagination(),
        data: [],
      }
    }

    return {
      code: 200,
      pagination: this.getApiPagination(),
      data: posts,
    }
  }

  /**
   * Get post by id
   * @param req `NextApiRequest`
   * @returns `GetPost`
   */
  static getPostById = async (
    req: NextApiRequest
  ): Promise<GetSpecificPost> => {
    const id = PostValidation.id(req)
    if (id instanceof Error) {
      return {
        ...error(400, id.message),
        data: null,
      }
    }

    const post = await PostDB.getPostById(id)
    if (post instanceof Error) {
      return {
        ...error(500, post.message),
        data: null,
      }
    }

    return {
      code: 200,
      data: post,
    }
  }

  /**
   * Update post by id
   * @param req `NextApiRequest`
   * @returns `UpdatedPost`
   */
  static updatePost = async (req: NextApiRequest): Promise<UpdatedPost> => {
    const post = await PostValidation.updatePost(req)
    if (post instanceof Error) {
      return error(400, post.message)
    }

    const updatedCount = await PostDB.updatePost(post.id, post)
    if (updatedCount instanceof Error) {
      return error(500, updatedCount.message)
    }

    const isUpdated = updatedCount > 0
    return {
      code: isUpdated ? 200 : 409,
      data: isUpdated ? 'OK' : 'NG',
    }
  }
}
