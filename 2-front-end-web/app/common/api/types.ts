export interface SimpleUser {
  id: number
  username: string
}

export type GenericListPagination<T> = {
  list: T[]
  totalCount: number
  pageInfo: PageInfo
}

export interface PageInfo {
  lastCursor: number | null
  hasNextPage: boolean
}
