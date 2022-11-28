import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { deleteComment } from '~/core/api/items$comments'
import { useItemIdParams } from './useItemIdParams'
import { getCommentListQueryKey } from '~/core/hook/query/useCommentListQuery'

export function useDeleteComment() {
  const queryClient = useQueryClient()
  const itemId = useItemIdParams()

  const deleteCommentFn = useCallback(
    async (commentId: number) => {
      if (!itemId) return

      await deleteComment({
        commentId,
        itemId,
      })

      await queryClient.invalidateQueries(getCommentListQueryKey(itemId))
    },
    [itemId, queryClient],
  )

  return deleteCommentFn
}
