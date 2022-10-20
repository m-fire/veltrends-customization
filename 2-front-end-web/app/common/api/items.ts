import { client, URL_API_SERVER } from './client.js'
import { Item } from './types.js'

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
