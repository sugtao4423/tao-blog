import { UpdatedTag } from '@/models/entities/api/tag'
import { withModifyAuth } from '@/services/api/api_handler'
import TagsService from '@/services/api/tags'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<UpdatedTag>
) => {
  if (req.method === 'PUT') {
    const { id } = req.query
    const { name } = req.body
    const updated = await TagsService.updateTag(id, name)
    res.status(updated.code).json(updated)
    return
  }

  const error = TagsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default withModifyAuth(handler)
