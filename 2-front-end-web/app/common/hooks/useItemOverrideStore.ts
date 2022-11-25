import produce from 'immer'
import create from 'zustand'
import { ItemStatus } from '~/common/api/types'

export const useItemOverrideStore = create<ItemOverrideStore>((set) => ({
  stateMap: {},
  set(itemId, overrideState) {
    set((store) =>
      produce(store, (draft) => {
        draft.stateMap[itemId] = overrideState
      }),
    )
  },
}))

export function useItemOverrideStateById(itemId: number) {
  const { stateMap } = useItemOverrideStore()
  return stateMap[itemId]
}

export function useItemOverrideStoreSetter() {
  return useItemOverrideStore((store) => store.set)
}

// types

interface ItemOverrideStore {
  stateMap: Record<number, ItemOverrideState>
  set(itemId: number, overrideState: ItemOverrideState): void
}

type ItemOverrideState = {
  itemStatus: ItemStatus
  isLiked: boolean
}
