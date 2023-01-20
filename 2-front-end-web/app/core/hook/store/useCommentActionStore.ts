import useAppStore, { EntityType } from './useAppStore'

export function useCommentStateMap() {
  const stateMap = useAppStore((store) => store.comments.stateMap)
  return stateMap
}

export function useCommentActionStateById(commentId: number) {
  const stateById = useCommentStateMap()[commentId]
  return stateById
}

export function useCommentStateAction() {
  const { setLiked } = useAppStore((store) => store.comments)
  return { setLiked }
}

export function useCommentInputState() {
  const commentInputState = useAppStore((store) => store.comments.input.state)
  return commentInputState
}
