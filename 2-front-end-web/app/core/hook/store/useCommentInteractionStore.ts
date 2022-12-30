import produce from 'immer'
import create from 'zustand'

export function useCommentInteractionStateById(commentId: number) {
  const stateMap = useCommentInteractionStore((store) => store.stateMap)
  return stateMap[commentId]
}

export function useCommentInteractionStateSetters() {
  const stateSetters = useCommentInteractionStore((store) => store.stateSetters)
  return stateSetters
}

export function useCommentRequestControls() {
  const requestControls = useCommentInteractionStore(
    (store) => store.requestControls,
  )
  return requestControls
}

export const useCommentInteractionStore = create<CommentInteractionStore>(
  (set) => ({
    stateMap: {},
    requestControls: {
      abortRequest: (commentId: number) =>
        set((store) => {
          store.stateMap[commentId].abortController?.abort()
          return store
        }),
      allowRequest: (commentId: number) =>
        set((store) =>
          produce(store, (next) => {
            next.stateMap[commentId].abortController = new AbortController()
          }),
        ),
      removeControl: (commentId: number) =>
        set((store) =>
          produce(store, (next) => {
            next.stateMap[commentId].abortController = null
          }),
        ),
    },
    stateSetters: {
      setLikeState: ({ commentId, prevLikeCount }) =>
        set((store) =>
          produce(store, (next) => {
            next.stateMap[commentId].likeCount = prevLikeCount + 1
            next.stateMap[commentId].isLiked = true
          }),
        ),
      setUnlikeState: ({ commentId, prevLikeCount }) =>
        set((store) =>
          produce(store, (next) => {
            next.stateMap[commentId].likeCount = prevLikeCount - 1
            next.stateMap[commentId].isLiked = false
          }),
        ),
    },
  }),
)

export interface CommentInteractionStore {
  stateMap: Record<number, CommentInteractState>
  requestControls: {
    abortRequest(commentId: number): void
    allowRequest(commentId: number): void
    removeControl(commentId: number): void
  }
  stateSetters: {
    setLikeState({ commentId, prevLikeCount }: CommentLikedParams): void
    setUnlikeState({ commentId, prevLikeCount }: CommentLikedParams): void
  }
}

type CommentLikedParams = { commentId: number; prevLikeCount: number }

export interface CommentInteractState {
  likeCount: number
  isLiked: boolean
  // 반복 재요청 방지
  abortController: AbortController | null
}
