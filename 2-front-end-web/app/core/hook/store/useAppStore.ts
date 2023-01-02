import create from 'zustand'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import { ItemStatus } from '~/core/api/types'
import { WritableDraft } from 'immer/dist/types/types-external'

const useAppStore = create(
  devtools<AppStore>((set, get) => ({
    items: {
      stateMap: {},
      stateActions: {
        setLiked: (itemId: number, itemStatus, isLiked) =>
          set((prev) =>
            produce(prev, (next) => {
              const stateById = extractTypeStateById('items', itemId, next)
              stateById.itemStatus = itemStatus
              stateById.isLiked = isLiked
            }),
          ),
        setBookmarked: (itemId: number, isBookmarked: boolean) =>
          set((prev) => {
            return produce(prev, (next) => {
              const stateById = extractTypeStateById('items', itemId, next)
              stateById.isBookmarked = isBookmarked
            })
          }),
      },
    },

    comments: {
      /* state by id */
      stateMap: {},
      stateActions: {
        setLiked: (commentId, likeCount, isLiked) =>
          set((prev) =>
            produce(prev, (next) => {
              if (likeCount == null) return
              const stateById = extractTypeStateById(
                'comments',
                commentId,
                next,
              )
              stateById.likeCount = likeCount
              stateById.isLiked = isLiked
            }),
          ),
      },

      /* input state & actions */
      inputState: {
        visible: false,
        parentCommentId: null,
        commentId: null,
        inputValue: '',
      },
      inputStateActions: {
        write: (parentCommentId) =>
          set((prev) =>
            produce(prev, (next) => {
              const inputState = next.comments.inputState
              inputState.parentCommentId = parentCommentId
              inputState.visible = true
            }),
          ),
        edit: (commentId: number, inputValue: string) =>
          set((prev) =>
            produce(prev, (next) => {
              const inputState = next.comments.inputState
              inputState.commentId = commentId
              inputState.inputValue = inputValue
              inputState.visible = true
            }),
          ),
        close: () =>
          set((prev) =>
            produce(prev, (next) => {
              next.comments.inputState.visible = false
            }),
          ),
      },
    },

    /*  request controls by entity's AbortController */

    abortRequestsActions: {
      abort: (type: EntityType, entityId: number) =>
        set((prev) =>
          produce(prev, (next) => {
            const stateById = extractTypeStateById(type, entityId, next)
            if (stateById.abortController != null) {
              stateById.abortController.abort()
              return
            }
            stateById.abortController = new AbortController()
          }),
        ),
      getController: (type: EntityType, entityId: number) =>
        extractTypeStateById(type, entityId, get()).abortController,
      remove: (type: EntityType, entityId: number) =>
        set((prev) =>
          produce(prev, (next) => {
            const stateById = extractTypeStateById(type, entityId, next)
            stateById.abortController = undefined
          }),
        ),
    },
  })),
)
export default useAppStore

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
      : {}
  >
}

// types

interface AppStore {
  items: {
    stateMap: Record<number, ItemActionState>
    stateActions: {
      setLiked: (
        entityId: number,
        itemStatus: ItemStatus,
        isLiked: boolean,
      ) => void
      setBookmarked: (entityId: number, isBookmarked: boolean) => void
    }
  }

  comments: {
    stateMap: Record<number, CommentActionState>
    stateActions: {
      setLiked: (entityId: number, likeCount: number, isLiked: boolean) => void
    }

    inputState: CommentInputState
    inputStateActions: {
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