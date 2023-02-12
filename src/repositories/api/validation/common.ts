export default class CommonValidation {
  /**
   * Check if some types are numbers
   * @param str Target string to check
   * @returns is number or not
   */
  static isNumber = (str: string | string[] | null | undefined): boolean => {
    if (!str || Array.isArray(str) || Number.isNaN(Number(str))) {
      return false
    }
    return true
  }
}
