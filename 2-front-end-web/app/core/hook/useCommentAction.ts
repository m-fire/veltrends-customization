import { useCallback, useMemo } from 'react'
import { likeComment, unlikeComment } from '~/core/api/items$comments'
import AppError from '~/common/error/AppError'
import { useCommentStateAction } from '~/core/hook/store/useCommentActionStore'
import { useAbortRequestAction } from '~/core/hook/http/useAbortRequestAction'
import useAppStore from './store/useAppStore'

export function useCommentAction() {
  const stateActions = useCommentStateAction()
  const requestAction = useAbortRequestAction('comments')

  const { setLiked } = stateActions
  const { abortRequest, getAbortController, removeAbortController } =
    requestAction

  // actions(interactions)

  const like = useCallback(
    async ({ itemId, commentId, likeCount }: CommentLikedParams) => {
      try {
        setLiked(commentId, likeCount)

        abortRequest(commentId)
        const result = await likeComment(
          { itemId, commentId },
          getAbortController(commentId),
        )
        if (result.id !== commentId) throw new AppError('Unknown')

        setLiked(result.id, result.likeCount)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      } finally {
        removeAbortController(commentId)
      }
    },
    [stateActions, requestAction],
  )

  const unlike = useCallback(
    async ({ itemId, commentId, likeCount }: CommentLikedParams) => {
      try {
        setLiked(commentId, likeCount)

        abortRequest(commentId)
        const result = await unlikeComment(
          { itemId, commentId },
          getAbortController(commentId),
        )
        if (result.id !== commentId) throw new AppError('Unknown')

        setLiked(result.id, result.likeCount)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      } finally {
        removeAbortController(commentId)
      }
    },
    [stateActions, requestAction],
  )

  return {
    likeComment: like,
    unlikeComment: unlike,
  }
}

export function useCommentInputAction() {
  const { write, edit, close } = useAppStore(
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

// types

type CommentLikedParams = {
  itemId: number
  commentId: number
  likeCount: number
}
