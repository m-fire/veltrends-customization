import { client } from './client'
import { Comment } from './types'
import { URL_ITEMS } from '~/common/api/items'

const URL_COMMENTS = '/comments'

export async function createComment({
  itemId,
  parentCommentId,
  text,
}: CreateCommentParams) {
  const response = await client.post<Comment>(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}`,
    {
      itemId,
      parentCommentId,
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

export async function likeComment(
  { itemId, commentId }: LikeCommentParams,
  controller?: AbortController,
) {
  const response = await client.post<LikeCommentResult>(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}/${commentId}/likes`,
    {},
    { signal: controller?.signal },
  )
  return response.data
}

export async function unlikeComment(
  { itemId, commentId }: UnlikeCommentParams,
  controller?: AbortController,
) {
  const response = await client.delete<UnlikeCommentResult>(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}/${commentId}/likes`,
    { signal: controller?.signal },
  )
  return response.data
}

// types

type CreateCommentParams = {
  itemId: number
  parentCommentId?: number
  text: string
}

type LikeCommentParams = {
  itemId: number
  commentId: number
}

type UnlikeCommentParams = LikeCommentParams

export type LikeCommentResult = {
  id: number
  likeCount: number
}

export type UnlikeCommentResult = LikeCommentResult
