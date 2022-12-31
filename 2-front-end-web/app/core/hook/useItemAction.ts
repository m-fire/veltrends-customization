import { useCallback } from 'react'
import {
  bookmarkItem,
  likeItem,
  unbookmarkItem,
  unlikeItem,
} from '~/core/api/items'
import AppError from '~/common/error/AppError'
import { ItemStatus } from '~/core/api/types'
import {
  useItemStateActions,
  useItemStateMap,
} from '~/core/hook/store/useItemActionStore'
import { useRequestControlAction } from '~/core/hook/http/useRequestControlAction'

export function useItemAction() {
  const requestControl = useRequestControlAction('items')
  const stateActions = useItemStateActions()
  const itemStateMap = useItemStateMap()

  // actions(interactions)

  const like = useCallback(
    async (itemId: number, prevItemStatus: ItemStatus) => {
      try {
        stateActions.setLiked(itemId, prevItemStatus)

        const result = await ignoreRepeatRequest(
          itemId,
          requestControl,
          (abortController) => {
            return likeItem(itemId, abortController)
          },
        )

        stateActions.setLiked(result.id, result.itemStatus)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [itemStateMap],
  )

  const unlike = useCallback(
    async (itemId: number, prevItemStatus: ItemStatus) => {
      try {
        stateActions.setLiked(itemId, prevItemStatus)

        const result = await ignoreRepeatRequest(
          itemId,
          requestControl,
          (abortController) => {
            return unlikeItem(itemId, abortController)
          },
        )

        stateActions.setLiked(result.id, result.itemStatus)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [itemStateMap],
  )

  const bookmark = useCallback(
    async (itemId: number) => {
      try {
        stateActions.setBookmarked(itemId, false)

        const result = await ignoreRepeatRequest(
          itemId,
          requestControl,
          (abortController) => {
            return bookmarkItem(itemId, abortController)
          },
        )

        stateActions.setBookmarked(result.id, true) // result.isBookmarked)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [itemStateMap],
  )

  const unbookmark = useCallback(
    async (itemId: number) => {
      try {
        stateActions.setBookmarked(itemId, true)

        const result = await ignoreRepeatRequest(
          itemId,
          requestControl,
          (abortController) => {
            return unbookmarkItem(itemId, abortController)
          },
        )

        stateActions.setBookmarked(result.id, false) // result.isBookmarked)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [itemStateMap],
  )

  const ignoreRepeatRequest = useCallback(
    async <R extends { id: number }>(
      entityId: number,
      {
        abortRequest,
        getAbortController,
        removeAbortController,
      }: ReturnType<typeof useRequestControlAction<'items'>>,
      requestApi: (abortController?: AbortController) => Promise<R>,
    ) => {
      abortRequest(entityId)

      const result = await requestApi(getAbortController(entityId))
      if (result.id !== entityId) throw new AppError('Unknown')

      removeAbortController(entityId)
      return result
    },
    [itemStateMap],
  )

  return {
    likeItem: like,
    unlikeItem: unlike,
    bookmarkItem: bookmark,
    unbookmarkItem: unbookmark,
  }
}
