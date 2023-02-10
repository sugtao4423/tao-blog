import { AuthVerify } from '@/models/entities/api/auth'
import AuthVerifyService from '@/services/api/auth_verify'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthVerify>
) {
  if (req.method !== 'POST') {
    const error = AuthVerifyService.MethodNotAllowedError
    res.status(error.code).json(error)
    return
  }

  const { authorization } = req.headers
  const result = AuthVerifyService.verify(authorization)
  res.status(result.code).json(result)
}
