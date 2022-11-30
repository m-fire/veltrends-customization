import create from 'zustand'

export const useCommentInputStore = create<CommentInputStore>((set) => ({
  state: {
    visible: false,
    parentCommentId: null,
    commentId: null,
    inputValue: '',
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
    edit: (commentId: number, inputValue: string) =>
      set((s) => ({
        ...s,
        state: {
          ...s.state,
          visible: true,
          commentId,
          inputValue,
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
    commentId: number | null
    inputValue: string
  }
  action: {
    write: (parentCommentId?: number | null) => void
    edit: (commentId: number, editedText: string) => void
    close: () => void
  }
}
