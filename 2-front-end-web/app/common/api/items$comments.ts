import { client } from './client'
import { Comment } from './types'
import { URL_ITEMS } from '~/common/api/items'

const URL_COMMENTS = '/comments'

export async function getCommentList(itemId: number) {
  const response = await client.get<Comment[]>(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}`,
  )
  return response.data
}
