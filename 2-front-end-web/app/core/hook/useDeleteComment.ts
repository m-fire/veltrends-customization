import { useCallback } from 'react'

export function useDeleteComment() {
  const deleteCommentFn = useCallback(async (commentId: number) => {}, [])

  return deleteCommentFn
}
