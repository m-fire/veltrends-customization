import { client, URL_API_SERVER } from './client.js'
import { Item, ItemListPagination } from './types.js'
import qs from 'qs'

const URL_ITEMS = URL_API_SERVER + '/api/items'

export async function createItem(params: CreateItemParams) {
  const response = await client.post<Item>(URL_ITEMS, params)
  return response.data
}

type CreateItemParams = {
  link: string
  title: string
  body: string
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
