import { CreatedTag } from '@/models/entities/api/tags'
import { withModifyAuth } from '@/services/api/api_handler'
import TagsService from '@/services/api/tags'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreatedTag>
) => {
  if (req.method === 'POST') {
    const { name } = req.body
    const tag = await TagsService.createTag(name)
    res.status(tag.code).json(tag)
    return
  }

  const error = TagsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default withModifyAuth(handler)
