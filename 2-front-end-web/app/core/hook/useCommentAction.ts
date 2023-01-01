import { useCallback, useMemo } from 'react'
import { likeComment, unlikeComment } from '~/core/api/items$comments'
import AppError from '~/common/error/AppError'
import {
  useCommentActionStateMap,
  useCommentStateAction,
} from '~/core/hook/store/useCommentActionStore'
import { useAbortRequestAction } from '~/core/hook/http/useAbortRequestAction'
import useAppActionStore from '~/core/hook/store/useAppActionStore'

export function useCommentAction() {
  const itemAbortActions = useAbortRequestAction('comments')
  const stateActions = useCommentStateAction()
  const itemStateMap = useCommentActionStateMap()

  // actions(interactions)

  const like = useCallback(
    async ({ itemId, commentId, likeCount }: CommentLikedParams) => {
      try {
        stateActions.setLiked(commentId, likeCount)

        const result = await ignoreRepeatRequest(
          commentId,
          itemAbortActions,
          (abortController) => {
            return likeComment({ itemId, commentId }, abortController)
          },
        )

        stateActions.setLiked(result.id, result.likeCount)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [itemStateMap],
  )

  const unlike = useCallback(
    async ({ itemId, commentId, likeCount }: CommentLikedParams) => {
      try {
        stateActions.setLiked(commentId, likeCount)

        const result = await ignoreRepeatRequest(
          commentId,
          itemAbortActions,
          (abortController) => {
            return unlikeComment({ itemId, commentId }, abortController)
          },
        )

        stateActions.setLiked(result.id, result.likeCount)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [itemStateMap],
  )

  const ignoreRepeatRequest = useCallback(
    async <R extends { id: number }>(
      entityId: number,
      {
        abortRequest,
        getAbortController,
        removeAbortController,
      }: ReturnType<typeof useAbortRequestAction<'comments'>>,
      requestApi: (abortController?: AbortController) => Promise<R>,
    ) => {
      abortRequest(entityId)

      const result = await requestApi(getAbortController(entityId))
      if (result.id !== entityId) throw new AppError('Unknown')

      removeAbortController(entityId)
      return result
    },
    [itemStateMap],
  )

  return {
    likeComment: like,
    unlikeComment: unlike,
  }
}

type CommentLikedParams = {
  itemId: number
  commentId: number
  likeCount: number
}

export function useCommentInputAction() {
  const { write, edit, close } = useAppActionStore(
    (s) => s.comments.inputStateActions,
  )

  const inputActionMemo = useMemo(
    () => ({
      writeComment: (parentCommentId: number | null) => write(parentCommentId),

      editComment: (commentId: number, edited: string) =>
        edit(commentId, edited),

      closeInput: () => close(),
    }),
    [write, edit, close],
  )

  return inputActionMemo
}
