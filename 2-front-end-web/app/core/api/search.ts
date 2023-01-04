import { client } from '~/common/api/client'
import { SearchedItem } from '~/core/api/types'
import { Pagination } from '~/common/api/types'

const URL_SEARCH = '/api/search'

export async function searchItemList({ q, offset }: SearchItemListParams) {
  const response = await client.get<Pagination<SearchedItem>>(URL_SEARCH, {
    params: { q, offset },
  })
  return response.data
}

type SearchItemListParams = {
  q: string
  offset?: number
}
