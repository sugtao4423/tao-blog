import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export default class DBTime {
  /**
   * Convert database datetime to unixtime
   * @param dbDatetime database datetime
   * @returns unixtime
   */
  static dbDatetime2Unixtime = (dbDatetime: string): number => {
    dayjs.extend(utc)
    return dayjs(dbDatetime).unix()
  }

  /**
   * Convert unixtime to database datetime
   * @param unixtime unixtime
   * @returns database datetime
   */
  static unixtime2DbDatetime = (unixtime: number): string => {
    return dayjs.unix(unixtime).utc().format('YYYY-MM-DD HH:mm:ss')
  }
}
