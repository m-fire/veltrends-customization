export interface User {
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
  itemStatus: ItemStatus
  isLiked: boolean
}

export interface Publisher {
  id: number
  name: string
  domain: string
  favicon: string | null
}

export interface ItemStatus {
  id: number
  likes: number
}

export type ItemListPagination = GenericListPagination<Item>
