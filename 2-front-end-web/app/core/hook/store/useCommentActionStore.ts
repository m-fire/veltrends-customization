import useAppActionStore, {
  EntityType,
} from '~/core/hook/store/useAppActionStore'

export function useCommentActionStateMap() {
  const stateMap = useAppActionStore((store) => store.comments.stateMap)
  return stateMap
}

export function useCommentActionStateById(commentId: number) {
  const stateById = useCommentActionStateMap()[commentId]
  return stateById
}

export function useCommentInputState() {
  const inputState = useAppActionStore((store) => store.comments.inputState)
  return inputState
}

export function useCommentStateAction() {
  const commentActions = useAppActionStore(
    (store) => store.comments.stateActions,
  )
  return commentActions
}
