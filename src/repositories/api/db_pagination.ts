import Pagination from '@/models/entities/api/pagination'

type DBPaginationProps = {
  page: number
  count: number
}

export default abstract class DBPagination {
  private page: number

  private count: number

  constructor({ page, count }: DBPaginationProps = { page: -1, count: -1 }) {
    this.page = page
    this.count = count
  }

  /** Is pagination */
  protected isPagination = (): boolean => {
    return this.page !== -1 && this.count !== -1
  }

  /**
   * Get pagination
   */
  protected getPagination = (): Pagination => {
    return { page: this.page, count: this.count }
  }

  /** Get pagination offset */
  protected getOffset = (): number => {
    return (this.page - 1) * this.count
  }

  /** Get pagination limit */
  protected getLimit = (): number => {
    return this.count
  }
}
