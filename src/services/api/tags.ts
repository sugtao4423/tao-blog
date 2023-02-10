import { CreatedTag } from '@/models/entities/api/tags'
import TagDB from '@/repositories/api/tag_db'

const error = (code: number, message: string): CreatedTag => ({
  error: true,
  code,
  message,
})

export default class TagsService {
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
}
