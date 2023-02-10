import { AuthLogin } from '@/models/entities/api/auth'
import AuthLoginService from '@/services/api/auth_login'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthLogin>
) {
  if (req.method !== 'POST') {
    const error = AuthLoginService.MethodNotAllowedError
    res.status(error.code).json(error)
    return
  }

  const { email, password } = req.body
  const result = await AuthLoginService.login(email, password)
  res.status(result.code).json(result)
}
