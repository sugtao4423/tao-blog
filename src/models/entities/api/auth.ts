export type AuthLogin = {
  error?: boolean
  message?: string
  code: number
  token: string | null
}

export type AuthVerify = {
  error?: boolean
  message?: string
  code: number
}
