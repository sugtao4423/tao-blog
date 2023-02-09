export default class DatabaseUpdateError extends Error {
  constructor(e: unknown, message: string) {
    super(message)
    this.name = 'DatabaseUpdateError'
    this.message = message
    this.stack = e instanceof Error ? e.stack : undefined
  }
}
