import { CreatedTag, PaginationGetTags } from '@/models/entities/api/tag'
import { withModifyAuth } from '@/services/api/api_handler'
import { parsePagination } from '@/services/api/pagination'
import TagsService from '@/services/api/tags'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreatedTag | PaginationGetTags>
) => {
  if (req.method === 'POST') {
    const created = await TagsService.createTag(req)
    res.status(created.code).json(created)
    return
  }
  if (req.method === 'GET') {
    const pagination = parsePagination(req)
    const tags = await new TagsService(pagination).getTags()
    res.status(tags.code).json(tags)
    return
  }

  const error = TagsService.MethodNotAllowedError
  res.status(error.code).json(error)
}

export default withModifyAuth(handler)
