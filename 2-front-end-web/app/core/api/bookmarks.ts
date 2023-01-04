import { client } from '~/common/api/client'
import { Bookmark, EmptyStringResult } from '~/core/api/types'
import { Pagination } from '~/common/api/types'

export const URL_BOOKMARKS = '/api/bookmarks' as const

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

export async function unbookmarkItem(
  itemId: number,
  controller?: AbortController,
) {
  const response = await client.delete<EmptyStringResult>(`${URL_BOOKMARKS}`, {
    params: { itemId },
    signal: controller?.signal,
  })
  return response.data
}

export async function getBookmarkItemList(cursor?: number) {
  const response = await client.get<Pagination<Bookmark>>(`${URL_BOOKMARKS}`, {
    params: { cursor },
  })
  return response.data
}
