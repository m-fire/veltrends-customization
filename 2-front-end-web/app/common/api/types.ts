export interface SimpleUser {
  id: number
  username: string
}

export type GenericPagination<T> = {
  list: T[]
  totalCount: number
  pageInfo: PageInfo
}

export interface PageInfo {
  nextOffset?: number | null
  lastCursor?: number | null
  hasNextPage: boolean
}
