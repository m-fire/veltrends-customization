import { client } from './client.js'
import { Comment } from './types.js'
import { URL_ITEMS } from '~/common/api/items.js'

const URL_COMMENTS = '/comments'

export async function getCommentList(itemId: number) {
  const response = await client.get<Comment[]>(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}`,
  )
  return response.data
}
