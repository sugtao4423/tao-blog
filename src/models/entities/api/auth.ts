import { CommonResponse } from './common_response'
import { GetUser } from './user'

export type AuthJwtPayload = {
  email: string
} & GetUser

export type AuthLogin = CommonResponse<string | null>

export type AuthVerify = CommonResponse<'OK' | 'NG'>
