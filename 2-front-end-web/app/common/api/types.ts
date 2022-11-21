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

export interface Item {
  id: number
  title: string
  body: string
  link: string
  thumbnail: string | null
  createdAt: string
  updatedAt: string
  author: string
  user: SimpleUser
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
  commentCount: number
}

export type ItemListPagination = GenericListPagination<Item>

export interface Comment {
  id: number
  text: string
  createdAt: string
  updatedAt: string
  likes: number
  subcommentCount: number
  user: SimpleUser
  /* Subcomment 의 subcommentList 는 undefined 인 경우를 위한 `?` 처리 */
  subcommentList?: Comment[]
}
