import create from 'zustand'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import { ItemStatus } from '~/core/api/types'
import { WritableDraft } from 'immer/dist/types/types-external'

const useAppActionStore = create(
  devtools<AppStore>((set, get) => ({
    items: {
      stateMap: {},
      stateActions: {
        setLiked: (entityId: number, itemStatus) =>
          set((s) =>
            produce(s, (next) => {
              const stateById = extractTypeStateById('items', entityId, next)
              const beforeLikeCount = stateById.itemStatus?.likeCount ?? -1
              stateById.itemStatus = itemStatus
              stateById.isLiked =
                beforeLikeCount + 1 === stateById.itemStatus.likeCount
            }),
          ),
        setBookmarked: (entityId: number, isBookmarked: boolean) =>
          set((s) => {
            return produce(s, (next) => {
              const stateById = extractTypeStateById('items', entityId, next)
              stateById.isBookmarked = isBookmarked
            })
          }),
      },
    },

    comments: {
      /* state by id */
      stateMap: {},
      stateActions: {
        setLiked: (entityId, likeCount) =>
          set((s) =>
            produce(s, (next) => {
              if (likeCount == null) return
              const stateById = extractTypeStateById('comments', entityId, next)
              const beforeLikeCount = stateById?.likeCount ?? -1
              stateById.likeCount = likeCount
              stateById.isLiked = beforeLikeCount + 1 === likeCount
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
          set((s) =>
            produce(s, (next) => {
              const inputState = extractInputState(next)
              inputState.parentCommentId = parentCommentId
              inputState.visible = true
            }),
          ),
        edit: (commentId: number, inputValue: string) =>
          set((s) =>
            produce(s, (next) => {
              const inputState = extractInputState(next)
              inputState.commentId = commentId
              inputState.inputValue = inputValue
              inputState.visible = true
            }),
          ),
        close: () =>
          set((s) =>
            produce(s, (next) => {
              const inputState = extractInputState(next)
              inputState.visible = false
            }),
          ),
      },
    },

    /*  request controls by entity's AbortController */

    abortRequestsActions: {
      abort: (type: EntityType, entityId: number) =>
        set((s) =>
          produce(s, (next) => {
            const stateById = extractTypeStateById(type, entityId, next)
            stateById.abortController?.abort()
            stateById.abortController = new AbortController()
          }),
        ),
      getController: (type: EntityType, entityId: number) =>
        extractTypeStateById(type, entityId, get()).abortController,
      remove: (type: EntityType, entityId: number) =>
        set((s) =>
          produce(s, (next) => {
            const stateById = extractTypeStateById(type, entityId, next)
            stateById.abortController = undefined
          }),
        ),
    },
  })),
)
export default useAppActionStore

// utils

function extractInputState(store: WritableDraft<AppStore>) {
  return store.comments.inputState
}

function extractTypeStateById<K extends EntityType>(
  type: K,
  entityId: number,
  store: WritableDraft<AppStore>,
) {
  let stateMap: WritableDraft<
    Record<number, Partial<ItemInteractState | CommentInteractState>>
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
      ? ItemInteractState
      : K extends 'comments'
      ? CommentInteractState
      : never
  >
}

// types

interface AppStore {
  items: {
    stateMap: Record<number, ItemInteractState>
    stateActions: {
      setLiked: (entityId: number, itemStatus: ItemStatus) => void
      setBookmarked: (entityId: number, isBookmarked: boolean) => void
    }
  }

  comments: {
    stateMap: Record<number, CommentInteractState>
    stateActions: {
      setLiked: (entityId: number, likeCount: number) => void
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

export interface ItemInteractState {
  itemStatus: ItemStatus
  isLiked: boolean
  isBookmarked: boolean
  // 반복 재요청 방지
  abortController?: AbortController
}

export interface CommentInteractState {
  likeCount: number
  isLiked: boolean
  // 반복 재요청 방지
  abortController?: AbortController
}

type CommentInputState = {
  visible: boolean
  parentCommentId: number | null
  commentId: number | null
  inputValue: string
}
