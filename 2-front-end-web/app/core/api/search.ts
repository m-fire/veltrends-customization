import { client } from '~/common/api/client'
import { SearchedItemPage } from '~/core/api/types'

const URL_SEARCH = '/api/search'

export async function searchItemList({ q, offset }: SearchItemListParams) {
  const response = await client.get<SearchedItemPage>(URL_SEARCH, {
    params: { q, offset },
  })
  return response.data
}

type SearchItemListParams = {
  q: string
  offset?: number
}
