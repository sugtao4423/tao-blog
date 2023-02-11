export default class DatabaseDeleteError extends Error {
  constructor(e: unknown, message: string) {
    super(message)
    this.name = 'DatabaseDeleteError'
    this.message = message
    this.stack = e instanceof Error ? e.stack : undefined
  }
}
