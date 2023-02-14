import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export default class DBTime {
  /**
   * @returns current database datetime
   */
  static now = (): string => {
    return dayjs().utc().format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * Convert database datetime to unixtime
   * @param dbDatetime database datetime
   * @returns unixtime
   */
  static toUnix = (dbDatetime: string): number => {
    return dayjs(dbDatetime).unix()
  }

  /**
   * Convert unixtime to database datetime
   * @param unixtime unixtime
   * @returns database datetime
   */
  static toDatetime = (unixtime: number): string => {
    return dayjs.unix(unixtime).utc().format('YYYY-MM-DD HH:mm:ss')
  }
}
