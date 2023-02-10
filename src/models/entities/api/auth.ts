import { CommonResponse } from './common_response'

export type AuthLogin = CommonResponse<string | null>

export type AuthVerify = CommonResponse<'OK' | 'NG'>
