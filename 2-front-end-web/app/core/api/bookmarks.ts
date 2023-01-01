import { client } from '~/common/api/client'
import { URL_BOOKMARKS } from '~/core/api/items'
import { Bookmark, GetBookmarkListResult } from '~/core/api/types'

export async function bookmarkItem(
  itemId: number,
  controller?: AbortController,
) {
  const response = await client.post<Bookmark>(
    `${URL_BOOKMARKS}`,
    { itemId },
    { signal: controller?.signal },
  )
  return response.data
}

export async function getBookmarkList(cursor?: number) {
  const response = await client.get<GetBookmarkListResult>('/api/bookmarks', {
    params: { cursor },
  })
  return response.data
}

export async function unbookmarkItem(
  itemId: number,
  controller?: AbortController,
) {
  const response = await client.delete(`${URL_BOOKMARKS}`, {
    params: { itemId },
    signal: controller?.signal,
  })
  return response.data
}
