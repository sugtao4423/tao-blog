export default class CommonValidation {
  static isNumber = (str: string | string[] | null | undefined): boolean => {
    if (!str || Array.isArray(str) || Number.isNaN(Number(str))) {
      return false
    }
    return true
  }
}
