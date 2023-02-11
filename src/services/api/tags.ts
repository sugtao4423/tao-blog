import {
  CreatedTag,
  PaginationGetTags,
  UpdatedTag,
} from '@/models/entities/api/tag'
import DBPagination from '@/repositories/api/db_pagination'
import TagDB from '@/repositories/api/tag_db'

const error = (code: number, message: string): CreatedTag => ({
  code,
  error: true,
  message,
  data: 'NG',
})

export default class TagsService extends DBPagination {
  static MethodNotAllowedError: CreatedTag = error(405, 'Method Not Allowed')

  static createTag = async (
    name: string | null | undefined
  ): Promise<CreatedTag> => {
    if (!name) {
      return error(400, 'Invalid name')
    }

    const tag = await TagDB.createTag(name)
    if (tag instanceof Error) {
      return error(500, tag.message)
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

  static updateTag = async (
    id: number | string | string[] | null | undefined,
    name: string | null | undefined
  ): Promise<UpdatedTag> => {
    if (!id || Array.isArray(id)) {
      return error(400, 'Invalid id')
    }
    if (!name) {
      return error(400, 'Invalid name')
    }

    const updated = await TagDB.updateTag(Number(id), name)
    if (updated instanceof Error) {
      return error(500, updated.message)
    }

    return {
      code: 200,
      data: 'OK',
    }
  }
}
