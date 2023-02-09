export default class DatabaseInsertError extends Error {
  constructor(e: unknown, message: string) {
    super(message)
    this.name = 'DatabaseInsertError'
    this.message = message
    this.stack = e instanceof Error ? e.stack : undefined
  }
}
