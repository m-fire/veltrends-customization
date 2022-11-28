import create from 'zustand'

const useBottomMenuModalStore = create<BottomMenuModalStore>((set) => ({
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
export default useBottomMenuModalStore

// types

export interface BottomMenuModalStore {
  state: {
    visible: boolean
    items: BottomMenuModalItem[]
  }
  action: {
    open(items: BottomMenuModalItem[]): void
    close(): void
  }
}

interface BottomMenuModalItem {
  name: string
  onClick(): void
}
