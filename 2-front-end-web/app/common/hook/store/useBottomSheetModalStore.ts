import { createStore } from 'zustand'

const initialStore = createStore<BottomSheetModalStore>((set) => ({
  state: {
    visible: false,
    items: [],
  },
  action: {
    open(items) {
      set((s) => ({
        ...s,
        state: {
          ...s.state,
          items,
          visible: true,
        },
      }))
    },
    close() {
      set((s) => ({
        ...s,
        state: {
          ...s.state,
          visible: false,
        },
      }))
    },
  },
}))
export default function useBottomSheetModalStore() {
  return initialStore.getState()
}

// types

export interface BottomSheetModalStore {
  state: {
    visible: boolean
    items: BottomSheetModalItem[]
  }
  action: {
    open: (items: BottomSheetModalItem[]) => void
    close: () => void
  }
}

interface BottomSheetModalItem {
  name: string
  onClick(): void
}
