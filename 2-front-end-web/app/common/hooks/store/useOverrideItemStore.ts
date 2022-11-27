import produce from 'immer'
import create from 'zustand'
import { ItemStatus } from '~/common/api/types'

export const useOverrideItemStore = create<OverrideItemStore>((set) => ({
  stateMap: {},
  set(itemId, overrideState) {
    set((store) =>
      produce(store, (draft) => {
        draft.stateMap[itemId] = overrideState
      }),
    )
  },
}))

export function useOverrideItemById(itemId: number) {
  const stateMap = useOverrideItemStore((store) => store.stateMap)
  return stateMap[itemId]
}

export function useOverrideItemSetter() {
  const storeSetter = useOverrideItemStore((store) => store.set)
  return storeSetter
}

// types

interface OverrideItemStore {
  stateMap: Record<number, OverrideItemState>
  set(itemId: number, overrideState: OverrideItemState): void
}

export type OverrideItemState = {
  itemStatus: ItemStatus
  isLiked: boolean
}
