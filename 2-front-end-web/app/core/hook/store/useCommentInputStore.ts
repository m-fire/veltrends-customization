import create from 'zustand'

export const useCommentInputStore = create<CommentInputStore>((set) => ({
  state: {
    visible: false,
    parentCommentId: null,
  },
  action: {
    write: (parentCommentId) =>
      set((s) => ({
        ...s,
        state: {
          ...s.state,
          parentCommentId: parentCommentId ?? null,
          visible: true,
        },
      })),
    close: () =>
      set((s) => ({
        ...s,
        state: {
          ...s.state,
          visible: false,
        },
      })),
  },
}))
export default useCommentInputStore

type CommentInputStore = {
  state: {
    visible: boolean
    parentCommentId: number | null
  }
  action: {
    write: (parentCommentId?: number | null) => void
    close: () => void
  }
}
