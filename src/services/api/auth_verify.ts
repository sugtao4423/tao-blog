import { AuthVerify } from '@/models/entities/api/auth'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

const { JWT_SECRET } = process.env

const errorMessage = (e: unknown): string => {
  if (e instanceof TokenExpiredError) return 'Expired token'
  if (e instanceof JsonWebTokenError) return 'Invalid token'
  return 'Unknown error'
}

export default class AuthVerifyService {
  static verify = (authorization: string | undefined): AuthVerify => {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return {
        error: true,
        message: 'No authorization header',
        code: 403,
      }
    }

    const token = authorization.split(' ')[1]
    try {
      jwt.verify(token, JWT_SECRET)
      return {
        code: 200,
      }
    } catch (e) {
      return {
        error: true,
        message: errorMessage(e),
        code: 403,
      }
    }
  }
}
