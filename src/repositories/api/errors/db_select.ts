export default class DatabaseSelectError extends Error {
  constructor(e: unknown, message: string) {
    super(message)
    this.name = 'DatabaseSelectError'
    this.message = message
    this.stack = e instanceof Error ? e.stack : undefined
  }
}
