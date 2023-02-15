import useAppStore, { EntityType } from './useAppStore'

export function useCommentStateMap() {
  return useAppStore().comments.stateMap
}

export function useCommentActionStateById(commentId: number) {
  return useCommentStateMap()[commentId]
}

export function useCommentStateAction() {
  const { setLiked } = useAppStore().comments
  return { setLiked }
}

export function useCommentInputState() {
  return useAppStore().comments.input.state
}
