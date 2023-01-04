import qs from 'qs'
import { client } from '~/common/api/client'
import { Item, LikedItemResult, ItemListMode } from './types'
import { Pagination } from '~/common/api/types'

export const URL_ITEMS = '/api/items' as const

export async function createItem(params: CreateItemParams) {
  const response = await client.post<Item>(URL_ITEMS, params)
  return response.data
}

export async function getItemList({
  mode,
  cursor,
  startDate,
  endDate,
}: GetItemListParams) {
  const response = await client.get<Pagination<Item>>(
    URL_ITEMS.concat(
      qs.stringify(
        { mode, cursor, startDate, endDate },
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

export async function updateItem({ itemId, link, title, body }: UpdateItem) {
  const response = await client.patch<Item>(`${URL_ITEMS}/${itemId}`, {
    link,
    title,
    body,
    tags: [], // TODO: tags
  })
  return response.data
}

export async function deleteItem(itemId: number) {
  return client.delete(`${URL_ITEMS}/${itemId}`)
}

export async function likeItem(itemId: number, controller?: AbortController) {
  const response = await client.post<LikedItemResult>(
    `${URL_ITEMS}/${itemId}/likes`,
    {},
    { signal: controller?.signal },
  )
  return response.data
}

export async function unlikeItem(itemId: number, controller?: AbortController) {
  const response = await client.delete<LikedItemResult>(
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

type GetItemListParams = {
  mode: ItemListMode
  cursor?: number
  startDate?: string
  endDate?: string
}

type UpdateItem = {
  itemId: number
  link: string
  title: string
  body: string
}
