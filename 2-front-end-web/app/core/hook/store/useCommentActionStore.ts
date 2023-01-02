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
  const commentStateActions = useAppStore(
    (store) => store.comments.stateActions,
  )
  return commentStateActions
}

export function useCommentInputState() {
  const inputState = useAppStore((store) => store.comments.inputState)
  return inputState
}
