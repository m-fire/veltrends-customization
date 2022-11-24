import { client } from './client'
import { Comment } from './types'
import { URL_ITEMS } from '~/common/api/items'

const URL_COMMENTS = '/comments'

export async function createComment({ itemId, text }: CreateCommentParams) {
  const response = await client.post<Comment>(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}`,
    {
      itemId,
      text,
    },
  )
  return response.data
}

export async function getCommentList(itemId: number) {
  const response = await client.get<Comment[]>(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}`,
  )
  return response.data
}

// types

type CreateCommentParams = {
  itemId: number
  text: string
}
