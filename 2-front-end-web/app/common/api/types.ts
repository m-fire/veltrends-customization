export type GenericListPagination<T> = {
  list: T[]
  totalCount: number
  pageInfo: PageInfo
}
export interface PageInfo {
  endCursor: number
  hasNextPage: boolean
}

export interface User {
  id: number
  username: string
}

export interface Item {
  id: number
  title: string
  body: string
  link: string
  thumbnail: string
  createdAt: string
  updatedAt: string
  author: string
  user: User
  publisher: Publisher
}
export interface Publisher {
  id: number
  name: string
  domain: string
  favicon: string
}

export type ItemListPagination = GenericListPagination<Item>
