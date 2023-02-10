import { AuthLogin } from '@/models/entities/api/auth'
import UserDB from '@/repositories/api/user_db'
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env

const error = (code: number, message: string): AuthLogin => ({
  code,
  error: true,
  message,
  data: null,
})

export default class AuthLoginService {
  static MethodNotAllowedError: AuthLogin = error(405, 'Method Not Allowed')

  static login = async (
    email: string | null | undefined,
    password: string | null | undefined
  ): Promise<AuthLogin> => {
    if (!email || !password) {
      return error(400, 'Invalid request')
    }

    const user = await UserDB.getUserByEmail(email)
    if (user instanceof Error) {
      return error(500, user.message)
    }
    if (!user) {
      return error(404, 'User not found')
    }

    const isValidPassword = await bycrypt.compare(password, user.hashedPassword)
    if (!isValidPassword) {
      return error(403, 'Invalid password')
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      url: user.url,
      createdAt: user.createdAt,
    }
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h',
    })

    return {
      code: 200,
      data: token,
    }
  }
}
