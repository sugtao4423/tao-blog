import { CreateTag, UpdateTag } from '@/models/entities/api/tag'
import { NextApiRequest } from 'next'
import CommonValidation from './common'

export default class TagValidation {
  /**
   * Validate `CreateTag`
   * @param req `NextApiRequest`
   * @returns `CreateTag | Error`
   */
  static createTag = (req: NextApiRequest): CreateTag | Error => {
    const tag = req.body as CreateTag
    if (!tag.name) {
      return new Error('Invalid name')
    }
    return tag
  }

  /**
   * Validate `UpdateTag`
   * @param req `NextApiRequest`
   * @returns `({ id: number } & UpdateTag) | Error`
   */
  static updateTag = (
    req: NextApiRequest
  ): ({ id: number } & UpdateTag) | Error => {
    const { id } = req.query
    if (!CommonValidation.isNumber(id)) {
      return new Error('Invalid id')
    }

    const tag = req.body as UpdateTag
    if (!tag.name) {
      return new Error('Invalid name')
    }

    return {
      id: Number(id),
      name: tag.name,
    }
  }

  /**
   * Validate delete tag id
   * @param req `NextApiRequest`
   * @returns To delete tag id
   */
  static deleteTagId = (req: NextApiRequest): number | Error => {
    const { id } = req.query
    if (!CommonValidation.isNumber(id)) {
      return new Error('Invalid id')
    }
    return Number(id)
  }
}
