import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { ItemStatus } from '~/core/api/types'
import { WritableDraft } from 'immer/dist/types/types-external'

const initialStore = createStore(
  devtools(
    immer<AppStore>((set, get) => ({
      items: {
        stateMap: {},
        setLiked: (itemId: number, itemStatus, isLiked) =>
          set((s) => {
            const stateById = extractTypeStateById('items', itemId, s)
            stateById.itemStatus = itemStatus
            stateById.isLiked = isLiked
          }),
        setBookmarked: (itemId: number, isBookmarked: boolean) =>
          set((s) => {
            const stateById = extractTypeStateById('items', itemId, s)
            stateById.isBookmarked = isBookmarked
          }),
      },

      comments: {
        /* state by id */
        stateMap: {},
        setLiked: (commentId, likeCount, isLiked) =>
          set((s) => {
            if (likeCount == null) return
            const stateById = extractTypeStateById('comments', commentId, s)
            stateById.likeCount = likeCount
            stateById.isLiked = isLiked
          }),

        /* input state & actions */
        input: {
          state: {
            visible: false,
            parentCommentId: null,
            commentId: null,
            inputValue: '',
          },
          write: (parentCommentId) =>
            set((s) => {
              const inputState = s.comments.input.state
              inputState.parentCommentId = parentCommentId
              inputState.visible = true
            }),
          edit: (commentId: number, inputValue: string) =>
            set((s) => {
              const inputState = s.comments.input.state
              inputState.commentId = commentId
              inputState.inputValue = inputValue
              inputState.visible = true
            }),
          close: () =>
            set((s) => {
              s.comments.input.state.visible = false
            }),
        },
      },

      /*  request controls by entity's AbortController */

      abortRequestsActions: {
        abort: (type: EntityType, entityId: number) =>
          set((s) => {
            const stateById = extractTypeStateById(type, entityId, s)
            if (stateById.abortController != null) {
              stateById.abortController.abort()
              return
            }
            stateById.abortController = new AbortController()
          }),
        getController: (type: EntityType, entityId: number) =>
          extractTypeStateById(type, entityId, get()).abortController,
        remove: (type: EntityType, entityId: number) =>
          set((s) => {
            const stateById = extractTypeStateById(type, entityId, s)
            stateById.abortController = undefined
          }),
      },
    })),
    { name: 'veltrend-app' },
  ),
)
export default function useAppStore() {
  return initialStore.getState()
}

// utils

function extractTypeStateById<K extends EntityType>(
  type: K,
  entityId: number,
  store: WritableDraft<AppStore>,
) {
  let stateMap: WritableDraft<
    Record<number, Partial<ItemActionState | CommentActionState> | undefined>
  >
  switch (type) {
    case 'items': {
      stateMap = store.items.stateMap
      break
    }
    case 'comments': {
      stateMap = store.comments.stateMap
      break
    }
    default:
      throw new Error(`Unhandled type: ${type}`)
  }
  if (stateMap[entityId] == null) stateMap[entityId] = {}

  return stateMap[entityId] as Partial<
    K extends 'items'
      ? ItemActionState
      : K extends 'comments'
      ? CommentActionState
      : never
  >
}

// types

interface AppStore {
  items: {
    stateMap: Record<number, ItemActionState>
    setLiked: (
      entityId: number,
      itemStatus: ItemStatus,
      isLiked: boolean,
    ) => void
    setBookmarked: (entityId: number, isBookmarked: boolean) => void
  }

  comments: {
    stateMap: Record<number, CommentActionState>
    setLiked: (entityId: number, likeCount: number, isLiked: boolean) => void

    input: {
      state: CommentInputState
      write: (parentCommentId: number | null) => void
      edit: (commentId: number, editedText: string) => void
      close: () => void
    }
  }

  abortRequestsActions: {
    abort(type: EntityType, entityId: number): void
    getController(
      type: EntityType,
      entityId: number,
    ): AbortController | undefined
    remove(type: EntityType, entityId: number): void
  }
}

export type EntityType = keyof Omit<AppStore, 'abortRequestsActions'>

export interface ItemActionState {
  itemStatus?: ItemStatus
  isLiked?: boolean
  isBookmarked?: boolean
  // 반복 재요청 방지
  abortController?: AbortController
}

export interface CommentActionState {
  likeCount?: number
  isLiked?: boolean
  // 반복 재요청 방지
  abortController?: AbortController
}

type CommentInputState = {
  visible: boolean
  parentCommentId: number | null
  commentId: number | null
  inputValue: string
}
