import {
  CreatedTag,
  DeletedTag,
  PaginationGetTags,
  UpdatedTag,
} from '@/models/entities/api/tag'
import DBPagination from '@/repositories/api/db_pagination'
import TagDB from '@/repositories/api/tag_db'
import TagValidation from '@/repositories/api/validation/tag'
import { NextApiRequest } from 'next'

const error = (code: number, message: string): CreatedTag => ({
  code,
  error: true,
  message,
  data: 'NG',
})

export default class TagsService extends DBPagination {
  static MethodNotAllowedError: CreatedTag = error(405, 'Method Not Allowed')

  /**
   * Create tag
   * @param req `NextApiRequest`
   * @returns `CreatedTag`
   */
  static createTag = async (req: NextApiRequest): Promise<CreatedTag> => {
    const tag = TagValidation.createTag(req)
    if (tag instanceof Error) {
      return error(400, tag.message)
    }

    const createdCount = await TagDB.createTag(tag)
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
   * Get tags with pagination
   * @returns `PaginationGetTags`
   */
  getTags = async (): Promise<PaginationGetTags> => {
    const tags = await TagDB.getTags(this.getPagination())
    if (tags instanceof Error) {
      return {
        ...error(500, tags.message),
        pagination: this.getApiPagination(),
        data: [],
      }
    }

    return {
      code: 200,
      pagination: this.getApiPagination(),
      data: tags,
    }
  }

  /**
   * Update tag by id
   * @param req `NextApiRequest`
   * @returns `UpdatedTag`
   */
  static updateTag = async (req: NextApiRequest): Promise<UpdatedTag> => {
    const tag = TagValidation.updateTag(req)
    if (tag instanceof Error) {
      return error(400, tag.message)
    }

    const updatedCount = await TagDB.updateTag(tag.id, tag)
    if (updatedCount instanceof Error) {
      return error(500, updatedCount.message)
    }

    const isUpdated = updatedCount > 0
    return {
      code: isUpdated ? 200 : 409,
      data: isUpdated ? 'OK' : 'NG',
    }
  }

  /**
   * Delete tag by id
   * @param req `NextApiRequest`
   * @returns `DeletedTag`
   */
  static deleteTag = async (req: NextApiRequest): Promise<DeletedTag> => {
    const tagId = TagValidation.deleteTagId(req)
    if (tagId instanceof Error) {
      return error(400, tagId.message)
    }

    const deletedCount = await TagDB.deleteTag(tagId)
    if (deletedCount instanceof Error) {
      return error(500, deletedCount.message)
    }

    const isDeleted = deletedCount > 0
    return {
      code: isDeleted ? 200 : 409,
      data: isDeleted ? 'OK' : 'NG',
    }
  }
}
