import create from 'zustand'

export const useCommentInputStore = create<CommentInputStateAndActions>(
  (set) => ({
    visible: false,
    parentCommentId: null,
    open: (parentCommentId) =>
      set((s) => ({ ...s, parentCommentId, visible: true })),
    close: () => set((s) => ({ ...s, visible: false })),
  }),
)

type CommentInputStateAndActions = {
  visible: boolean
  parentCommentId: number | null
  open(parentCommentId: number | null): void
  close(): void
}
