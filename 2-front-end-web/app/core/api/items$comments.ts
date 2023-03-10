import { client } from '../../common/api/client'
import { Comment } from './types'
import { URL_ITEMS } from '~/core/api/items'

const URL_COMMENTS = '/comments' as const

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

export async function editComment({
  itemId,
  text,
  commentId,
}: EditCommentParams) {
  const response = await client.patch<Comment>(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}/${commentId}`,
    { itemId, text },
  )
  return response.data
}

export async function deleteComment({
  itemId,
  commentId,
}: DeleteCommentParams) {
  const response = await client.delete(
    `${URL_ITEMS}/${itemId}${URL_COMMENTS}/${commentId}`,
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

type EditCommentParams = {
  itemId: number
  text: string
  commentId?: number
}

type DeleteCommentParams = { itemId: number; commentId: number }

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
