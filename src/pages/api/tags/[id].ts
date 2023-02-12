import { UpdatedTag } from '@/models/entities/api/tag'
import { withModifyAuth } from '@/services/api/api_handler'
import TagsService from '@/services/api/tags'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<UpdatedTag>
) => {
  if (req.method === 'PUT') {
    const updated = await TagsService.updateTag(req)
    res.status(updated.code).json(updated)
    return
  }
  if (req.method === 'DELETE') {
    const deleted = await TagsService.deleteTag(req)
    res.status(deleted.code).json(deleted)
    return
  }

  const error = TagsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default withModifyAuth(handler)
