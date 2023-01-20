export interface AuthUser {
  id: number
  username: string
}

export type Pagination<T> = {
  list: T[]
  totalCount: number
  pageInfo: PageInfo
}

export interface PageInfo {
  nextOffset?: number | null
  lastCursor?: number | null
  hasNextPage: boolean
}
