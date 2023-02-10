import { CreatedTag, PaginationGetTags } from '@/models/entities/api/tags'
import { withModifyAuth } from '@/services/api/api_handler'
import { parsePagination } from '@/services/api/pagination'
import TagsService from '@/services/api/tags'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreatedTag | PaginationGetTags>
) => {
  if (req.method === 'POST') {
    const { name } = req.body
    const tag = await TagsService.createTag(name)
    res.status(tag.code).json(tag)
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
