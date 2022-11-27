import produce from 'immer'
import create from 'zustand'

export const useOverrideCommentStore = create<OverrideCommentStore>((set) => ({
  stateMap: {},
  set(commentId, overrideState) {
    set((store) =>
      produce(store, (draft) => {
        draft.stateMap[commentId] = overrideState
      }),
    )
  },
}))

export function useOverrideCommendById(commentId: number) {
  const stateMap = useOverrideCommentStore((store) => store.stateMap)
  return stateMap[commentId]
}

export function useOverrideCommendSetter() {
  return useOverrideCommentStore((store) => store.set)
}

// types

interface OverrideCommentStore {
  stateMap: Record<number, OverrideCommentState | undefined>
  set(commentId: number, commentLike: OverrideCommentState): void
}

export type OverrideCommentState = {
  likeCount: number
  isLiked: boolean
}
