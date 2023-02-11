import {
  CreatedTag,
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

  static createTag = async (req: NextApiRequest): Promise<CreatedTag> => {
    const tag = TagValidation.createTag(req)
    if (tag instanceof Error) {
      return error(400, tag.message)
    }

    const created = await TagDB.createTag(tag)
    if (created instanceof Error) {
      return error(500, created.message)
    }

    return {
      code: 201,
      data: 'OK',
    }
  }

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

  static updateTag = async (req: NextApiRequest): Promise<UpdatedTag> => {
    const tag = TagValidation.updateTag(req)
    if (tag instanceof Error) {
      return error(400, tag.message)
    }

    const updated = await TagDB.updateTag(tag.id, tag)
    if (updated instanceof Error) {
      return error(500, updated.message)
    }

    return {
      code: 200,
      data: 'OK',
    }
  }
}
