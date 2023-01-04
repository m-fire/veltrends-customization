import { useCallback } from 'react'
import { likeItem, unlikeItem } from '~/core/api/items'
import { bookmarkItem, unbookmarkItem } from '~/core/api/bookmarks'
import AppError from '~/common/error/AppError'
import { ItemStatus } from '~/core/api/types'
import {
  useItemStateAction,
  useItemStateMap,
} from '~/core/hook/store/useItemActionStore'
import { useAbortRequestAction } from '~/core/hook/http/useAbortRequestAction'

export function useItemAction() {
  const stateActions = useItemStateAction()
  const requestActions = useAbortRequestAction('items')

  const { setLiked, setBookmarked } = stateActions
  const { abortRequest, getAbortController, removeAbortController } =
    requestActions

  /* like actions */

  const like = useCallback(
    async (
      itemId: number,
      prevItemStatus: ItemStatus,
      currentLiked: boolean,
    ) => {
      try {
        abortRequest(itemId)
        setLiked(itemId, prevItemStatus, currentLiked)

        const result = await likeItem(itemId, getAbortController(itemId))
        if (
          result?.id !== itemId &&
          prevItemStatus.likeCount + 1 !== result.itemStatus.likeCount
        )
          throw new AppError('Unknown')

        setLiked(result.id, result.itemStatus, true)
        removeAbortController(itemId)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [stateActions, requestActions],
  )

  const unlike = useCallback(
    async (
      itemId: number,
      prevItemStatus: ItemStatus,
      currentLiked: boolean,
    ) => {
      try {
        abortRequest(itemId)
        setLiked(itemId, prevItemStatus, currentLiked)

        const result = await unlikeItem(itemId, getAbortController(itemId))
        if (
          result?.id !== itemId &&
          prevItemStatus.likeCount - 1 !== result.itemStatus.likeCount
        )
          throw new AppError('Unknown')

        setLiked(result.id, result.itemStatus, false)
        removeAbortController(itemId)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [stateActions, requestActions],
  )

  /* bookmark actions */

  const stateMap = useItemStateMap()

  const bookmark = useCallback(
    async (itemId: number, currentMarked: boolean) => {
      try {
        abortRequest(itemId)
        setBookmarked(itemId, currentMarked)

        const result = await bookmarkItem(itemId, getAbortController(itemId))

        /* 유효성검사 시 북마크는 연관엔티티 item.id 와 비교해야 한다 */
        if (result?.item.id !== itemId) throw new AppError('Unknown')

        setBookmarked(itemId, result.item.isBookmarked)
        removeAbortController(itemId)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [stateActions, requestActions],
  )

  const unbookmark = useCallback(
    async (itemId: number, currentMarked: boolean) => {
      try {
        abortRequest(itemId)
        setBookmarked(itemId, currentMarked)

        const nullableResult = await unbookmarkItem(
          itemId,
          getAbortController(itemId),
        )

        /* 북마크 제거 시 반환값이 null | undefined 이어야 정상응답 이다 */
        if (nullableResult !== '') throw new AppError('Unknown')

        setBookmarked(itemId, false)
        removeAbortController(itemId)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [stateActions, requestActions],
  )

  return {
    likeItem: like,
    unlikeItem: unlike,
    bookmarkItem: bookmark,
    unbookmarkItem: unbookmark,
  }
}
