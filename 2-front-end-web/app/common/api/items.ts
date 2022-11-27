import qs from 'qs'
import { client } from './client'
import { Item, ItemListPagination, ItemStatus } from './types'

export const URL_ITEMS = '/api/items'

export async function createItem(params: CreateItemParams) {
  const response = await client.post<Item>(URL_ITEMS, params)
  return response.data
}

export async function getItemList(cursor?: number) {
  const response = await client.get<ItemListPagination>(
    URL_ITEMS.concat(
      qs.stringify(
        { cursor },
        { addQueryPrefix: true }, // 쿼리스트링 구분자 `?` 추가
      ),
    ),
  )
  return response.data
}

export async function getItem(itemId: number) {
  const response = await client.get<Item>(`${URL_ITEMS}/${itemId}`)
  return response.data
}

export async function likeItem(itemId: number, controller?: AbortController) {
  const response = await client.post<LikeItemResult>(
    `${URL_ITEMS}/${itemId}/likes`,
    {},
    { signal: controller?.signal },
  )
  return response.data
}

export async function unlikeItem(itemId: number, controller?: AbortController) {
  const response = await client.delete<UnlikeItemResult>(
    `${URL_ITEMS}/${itemId}/likes`,
    { signal: controller?.signal },
  )
  return response.data
}

// Types

type CreateItemParams = {
  link: string
  title: string
  body: string
}

export type LikeItemResult = {
  id: number
  itemStatus: ItemStatus
}

export type UnlikeItemResult = LikeItemResult
