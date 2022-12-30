import produce from 'immer'
import create from 'zustand'
import { ItemStatus } from '~/core/api/types'

export function useItemInteractionStateById(itemId: number) {
  const stateMap = useItemInteractionStore((store) => store.stateMap)
  return stateMap[itemId]
}

export function useItemInteractionStateSetters() {
  const stateSetters = useItemInteractionStore((store) => store.stateSetters)
  return stateSetters
}

export function useItemRequestControls() {
  const requestControls = useItemInteractionStore(
    (store) => store.requestControls,
  )
  return requestControls
}

export const useItemInteractionStore = create<ItemInteractionStore>((set) => ({
  stateMap: {},
  requestControls: {
    abortRequest: (itemId: number) =>
      set((store) => {
        store.stateMap[itemId].abortController?.abort()
        return store
      }),
    allowRequest: (itemId: number) =>
      set((store) =>
        produce(store, (next) => {
          next.stateMap[itemId].abortController = new AbortController()
        }),
      ),
    removeControl: (itemId: number) =>
      set((store) =>
        produce(store, (next) => {
          next.stateMap[itemId].abortController = null
        }),
      ),
  },
  stateSetters: {
    setLikeState: (itemId: number, itemStatus) =>
      set((store) =>
        produce(store, (next) => {
          next.stateMap[itemId].itemStatus = itemStatus
          next.stateMap[itemId].itemStatus.likeCount = itemStatus.likeCount + 1
          next.stateMap[itemId].isLiked = true
        }),
      ),
    setUnlikeState: (itemId: number, itemStatus) =>
      set((store) =>
        produce(store, (next) => {
          next.stateMap[itemId].itemStatus = itemStatus
          next.stateMap[itemId].itemStatus.likeCount = itemStatus.likeCount - 1
          next.stateMap[itemId].isLiked = false
        }),
      ),
    setBookmarkState: (itemId: number) =>
      set((store) =>
        produce(store, (next) => {
          next.stateMap[itemId].isBookmarked = true
        }),
      ),
    setUnbookmarkState: (itemId: number) =>
      set((store) =>
        produce(store, (next) => {
          next.stateMap[itemId].isBookmarked = false
        }),
      ),
  },
}))

export interface ItemInteractionStore {
  stateMap: Record<number, ItemInteractState>
  requestControls: {
    abortRequest(itemId: number): void
    allowRequest(itemId: number): void
    removeControl(itemId: number): void
  }
  stateSetters: {
    setLikeState(itemId: number, itemStatus: ItemStatus): void
    setUnlikeState(itemId: number, itemStatus: ItemStatus): void
    setBookmarkState(itemId: number): void
    setUnbookmarkState(itemId: number): void
  }
}

export interface ItemInteractState {
  itemStatus: ItemStatus
  isLiked: boolean
  isBookmarked: boolean
  // 반복 재요청 방지
  abortController: AbortController | null
}
