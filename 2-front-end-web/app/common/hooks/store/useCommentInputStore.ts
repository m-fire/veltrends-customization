import create from 'zustand'

export const useCommentInputStore = create<CommentInputStoreState>((set) => ({
  visible: false,
}))

type CommentInputStoreState = {
  visible: boolean
}
