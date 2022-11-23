import create from 'zustand'

export const useCommentInputStore = create<CommentInputStoreState>((set) => ({
  visible: false,
  open: () => set((s) => ({ ...s, visible: true })),
  // close: () => set((s) => ({ ...s, visible: false })),
}))

type CommentInputStoreState = {
  visible: boolean
  open(): void
  // close(): void
}
