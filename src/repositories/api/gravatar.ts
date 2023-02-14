import { Md5 } from 'ts-md5'

type GravatarFallback =
  // eslint-disable-next-line @typescript-eslint/ban-types
  | String
  | '404'
  | 'mp'
  | 'identicon'
  | 'monsterid'
  | 'wavatar'
  | 'retro'
  | 'robohash'
  | 'blank'

/**
 * Make Gravatar URL
 * @param email User email
 * @param fallback Fallback image type. Pass string to use custom image url. Default `mp`.
 * @param size Image size. 1 ~ 2048px. Default `200px`.
 * @returns Gravatar URL
 */
const GravatarUrl = (
  email: string | null | undefined,
  fallback: GravatarFallback = 'mp',
  size = 200
): string => {
  const hash = email ? Md5.hashStr(email.trim().toLowerCase()) : ''
  const url = new URL(`https://www.gravatar.com/avatar/${hash}`)
  url.searchParams.append('d', fallback.toString())
  url.searchParams.append('s', size.toString())
  return url.toString()
}

export default GravatarUrl
