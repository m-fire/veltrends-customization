import { GenericPagination, SimpleUser } from '~/common/api/types'

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
  likeCount: number
  commentCount: number
}

export type ItemListPagination = GenericPagination<Item>

export interface Comment {
  id: number
  text: string
  likeCount: number
  subcommentCount: number
  createdAt: string
  updatedAt: string
  user: SimpleUser
  mentionUser: SimpleUser | null
  /* Subcomment 의 subcommentList 는 undefined 인 경우를 위한 `?` 처리 */
  subcommentList?: Comment[]
  isDeleted: boolean
  isLiked: boolean
}
