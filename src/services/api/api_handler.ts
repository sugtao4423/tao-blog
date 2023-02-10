import { AuthVerify } from '@/models/entities/api/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import AuthVerifyService from './auth_verify'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const withModifyAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method as HttpMethod
    if (requestMethod === 'GET') {
      return handler(req, res)
    }

    const { authorization } = req.headers
    const verify = AuthVerifyService.verify(authorization)
    if (verify.error) {
      const error: AuthVerify = {
        code: 401,
        error: true,
        message: 'Unauthorized',
        data: 'NG',
      }
      return res.status(error.code).json(error)
    }

    return handler(req, res)
  }
}
