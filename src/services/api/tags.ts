import { CreatedTag, PaginationGetTags } from '@/models/entities/api/tag'
import DBPagination from '@/repositories/api/db_pagination'
import TagDB from '@/repositories/api/tag_db'

const error = (
  code: number,
  message: string
): CreatedTag | PaginationGetTags => ({
  error: true,
  code,
  message,
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
    }
  }

  getTags = async (): Promise<PaginationGetTags> => {
    const tags = await TagDB.getTags({
      offset: this.getOffset(),
      limit: this.getLimit(),
    })
    if (tags instanceof Error) {
      return {
        ...error(500, tags.message),
        pagination: this.getPagination(),
        tags: [],
      }
    }

    return {
      code: 200,
      pagination: this.getPagination(),
      tags,
    }
  }
}
