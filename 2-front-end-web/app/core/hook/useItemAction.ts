import { useCallback } from 'react'
import { likeItem, unlikeItem } from '~/core/api/items'
import { bookmarkItem, unbookmarkItem } from '~/core/api/bookmarks'
import AppError from '~/common/error/AppError'
import { ItemStatus } from '~/core/api/types'
import {
  useItemStateActions,
  useItemStateMap,
} from '~/core/hook/store/useItemActionStore'
import { useAbortRequestAction } from '~/core/hook/http/useAbortRequestAction'

export function useItemAction() {
  const abortRequestAction = useAbortRequestAction('items')
  const stateActions = useItemStateActions()
  const itemStateMap = useItemStateMap()

  // actions(interactions)

  const like = useCallback(
    async (itemId: number, prevItemStatus: ItemStatus) => {
      try {
        stateActions.setLiked(itemId, prevItemStatus)

        const result = await ignoreRepeatRequest(
          itemId,
          abortRequestAction,
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
          abortRequestAction,
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

  const { abortRequest, getAbortController, removeAbortController } =
    abortRequestAction
  const bookmark = useCallback(
    async (itemId: number) => {
      try {
        stateActions.setBookmarked(itemId, false)

        abortRequest(itemId)
        const result = await bookmarkItem(itemId, getAbortController(itemId))
        /* 북마크는 연관엔티티 item.id 와 비교해야 한다 */
        if (result.item.id !== itemId) throw new AppError('Unknown')
        removeAbortController(itemId)

        stateActions.setBookmarked(itemId, result.item.isBookmarked)
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
          abortRequestAction,
          (abortController) => {
            return unbookmarkItem(itemId, abortController)
          },
        )
        if (result == null) {
          stateActions.setBookmarked(itemId, false)
        }
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
      }: ReturnType<typeof useAbortRequestAction<'items'>>,
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
