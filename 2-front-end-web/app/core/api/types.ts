import { Account } from '~/common/api/types'

// general result

export type EmptyStringResult = ''

// serialized entity result

export interface Item {
  id: number
  title: string
  body: string
  link: string
  thumbnail: string | null
  createdAt: string
  updatedAt: string
  author: string
  user: Account
  publisher: Publisher
  itemStatus: ItemStatus
  isLiked: boolean
  isBookmarked: boolean
}

export interface Publisher {
  id?: number
  name: string
  domain: string
  favicon: string | null
}

export interface ItemStatus {
  id: number
  likeCount: number
  commentCount: number
}

export type ItemListMode = 'recent' | 'trending' | 'past'

export type LikedItemResult = {
  id: number
  itemStatus: ItemStatus
}

export interface Comment {
  id: number
  text: string
  likeCount: number
  subcommentCount: number
  createdAt: string
  updatedAt: string
  user: Account
  mentionUser: Account | null
  /* Subcomment 의 subcommentList 는 undefined 인 경우를 위한 `?` 처리 */
  subcommentList?: Comment[]
  isDeleted: boolean
  isLiked: boolean
}

export interface Bookmark {
  id: number
  item: Item
  createdAt: string
}

// algolia search result

export interface SearchedItem {
  id: number
  link: string
  title: string
  body: string
  author: null
  likeCount: number
  publisher: Pick<Publisher, 'name' | 'favicon' | 'domain'>
  highlight: Highlight
}

export interface Highlight {
  title: string
  body: string
}
