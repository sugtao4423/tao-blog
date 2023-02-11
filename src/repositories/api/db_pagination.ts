import Pagination from '@/models/entities/api/pagination'
import { DatabasePagination } from '@/models/entities/database'

export default abstract class DBPagination {
  private page: number

  private count: number

  constructor(pagination: Pagination | null) {
    this.page = pagination?.page ?? -1
    this.count = pagination?.count ?? -1
  }

  /** Is pagination */
  private isPagination = (): boolean => {
    return this.page !== -1 && this.count !== -1
  }

  /** Get pagination */
  protected getPagination = (): DatabasePagination | null => {
    if (!this.isPagination()) return null
    return {
      offset: (this.page - 1) * this.count,
      limit: this.count,
    }
  }

  /** Get api pagination */
  protected getApiPagination = (): Pagination => {
    return { page: this.page, count: this.count }
  }
}
