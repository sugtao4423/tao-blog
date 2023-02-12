import { AuthVerify } from '@/models/entities/api/auth'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

const { JWT_SECRET } = process.env

const error = (code: number, message: string): AuthVerify => ({
  code,
  error: true,
  message,
  data: 'NG',
})

const errorMessage = (e: unknown): string => {
  if (e instanceof TokenExpiredError) return 'Expired token'
  if (e instanceof JsonWebTokenError) return 'Invalid token'
  return 'Unknown error'
}

export default class AuthVerifyService {
  static MethodNotAllowedError: AuthVerify = error(405, 'Method Not Allowed')

  /**
   * Verify token
   * @param authorization Http authorization header
   * @returns `AuthVerify`
   */
  static verify = (authorization: string | undefined): AuthVerify => {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return error(403, 'No authorization header')
    }

    const token = authorization.split(' ')[1]
    try {
      jwt.verify(token, JWT_SECRET)
      return {
        code: 200,
        data: 'OK',
      }
    } catch (e) {
      return error(403, errorMessage(e))
    }
  }
}
