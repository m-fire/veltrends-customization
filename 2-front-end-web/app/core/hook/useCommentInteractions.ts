import { useCallback } from 'react'
import { likeComment, unlikeComment } from '~/core/api/items$comments'
import {
  CommentInteractionStore,
  useCommentInteractionStateById,
  useCommentInteractionStateSetters,
  useCommentRequestControls,
} from '~/core/hook/store/useCommentInteractionStore'
import AppError from '~/common/error/AppError'

export function useCommentInteractions() {
  const requestControls = useCommentRequestControls()
  const stateSetter = useCommentInteractionStateSetters()

  const like = useCallback(
    async ({ itemId, commentId, prevLikeCount }: CommentInteractionParams) => {
      try {
        stateSetter.setLikeState({ commentId, prevLikeCount })
        const result = await validateRequestAndResult(
          itemId,
          requestControls,
          (abortController) => {
            return likeComment({ itemId, commentId }, abortController)
          },
        )
        stateSetter.setLikeState({
          commentId: result.id,
          prevLikeCount: result.likeCount,
        })
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [],
  )

  const unlike = useCallback(
    async ({ itemId, commentId, prevLikeCount }: CommentInteractionParams) => {
      try {
        stateSetter.setUnlikeState({ commentId, prevLikeCount })
        const result = await validateRequestAndResult(
          itemId,
          requestControls,
          (abortController) => {
            return unlikeComment({ itemId, commentId }, abortController)
          },
        )
        stateSetter.setUnlikeState({
          commentId: result.id,
          prevLikeCount: result.likeCount,
        })
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [],
  )

  return {
    likeComment: like,
    unlikeComment: unlike,
  }
}

type CommentInteractionParams = {
  itemId: number
  commentId: number
  prevLikeCount: number
}

async function validateRequestAndResult<R extends { id: number }>(
  id: number,
  requestControls: CommentInteractionStore['requestControls'],
  requestApi: (abortController?: AbortController) => Promise<R>,
) {
  // 직전에 API 호출이 있었다면, 직전 호출 취소!
  requestControls.abortRequest(id)
  // 첫 API호출 시 AbortController 세팅
  requestControls.allowRequest(id)

  const stateById = useCommentInteractionStateById(id)
  const result = await requestApi(stateById.abortController ?? undefined)
  if (result.id !== id) throw new AppError('Unknown')

  // 정상 응답처리 시, AbortController 제거
  requestControls.removeControl(id)
  return result
}
