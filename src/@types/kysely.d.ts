import 'kysely'

declare module 'kysely' {
  export declare type LeftJoinedDB<DB, A extends keyof any, R> = {
    [C in keyof DB | A]: C extends A
      ? Nullable<R>
      : C extends keyof DB
      ? DB[C]
      : never
  }
}
