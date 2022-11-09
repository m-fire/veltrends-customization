import { useCallback } from 'react'
import { useItemOverride } from '~/context/ItemStatusContext'
import { likeItem, unlikeItem } from '~/common/api/items'
import { ItemStatus } from '~/common/api/types'

export function useItemLikeActions() {
  const { actions } = useItemOverride()
  const like = useCallback(
    async (id: number, initialStatus: ItemStatus) => {
      try {
        actions.set(id, {
          itemStatus: { ...initialStatus, likes: initialStatus.likes + 1 },
          isLiked: true,
        })
        const result = await likeItem(id)
        actions.set(id, {
          itemStatus: result.itemStatus,
          isLiked: true,
        })
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [actions],
  )
  const unlike = useCallback(
    async (id: number, initialStats: ItemStatus) => {
      try {
        actions.set(id, {
          itemStatus: { ...initialStats, likes: initialStats.likes - 1 },
          isLiked: false,
        })
        const result = await unlikeItem(id)
        actions.set(id, {
          itemStatus: result.itemStatus,
          isLiked: false,
        })
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [actions],
  )

  return { like, unlike }
}
