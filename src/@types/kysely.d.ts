import 'kysely'

declare module 'kysely' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export declare type LeftJoinedDB<DB, A extends keyof any, R> = {
    [C in keyof DB | A]: C extends A
      ? Nullable<R>
      : C extends keyof DB
      ? DB[C]
      : never
  }
}
