import create from 'zustand'

const useBottomSheetModalStore = create<BottomSheetModalStore>((set) => ({
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
export default useBottomSheetModalStore

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
