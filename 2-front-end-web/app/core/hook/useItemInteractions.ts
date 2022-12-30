import { useCallback } from 'react'
import { likeItem, unlikeItem } from '~/core/api/items'
import {
  ItemInteractionStore,
  useItemInteractionStateById,
  useItemInteractionStateSetters,
  useItemRequestControls,
} from '~/core/hook/store/useItemInteractionStore'
import AppError from '~/common/error/AppError'
import { ItemStatus } from '~/core/api/types'

export function useItemInteractions() {
  const requestControls = useItemRequestControls()
  const stateSetters = useItemInteractionStateSetters()

  const like = useCallback(
    async (itemId: number, prevItemStatus: ItemStatus) => {
      try {
        stateSetters.setLikeState(itemId, prevItemStatus)
        const result = await validateRequestAndResult(
          itemId,
          requestControls,
          (abortController) => {
            return likeItem(itemId, abortController)
          },
        )
        stateSetters.setLikeState(result.id, result.itemStatus)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [],
  )

  const unlike = useCallback(
    async (itemId: number, prevItemStatus: ItemStatus) => {
      try {
        stateSetters.setUnlikeState(itemId, prevItemStatus)
        const result = await validateRequestAndResult(
          itemId,
          requestControls,
          (abortController) => {
            return unlikeItem(itemId, abortController)
          },
        )
        stateSetters.setUnlikeState(result.id, result.itemStatus)
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [],
  )

  return {
    likeItem: like,
    unlikeItem: unlike,
  }
}

async function validateRequestAndResult<R extends { id: number }>(
  id: number,
  requestControls: ItemInteractionStore['requestControls'],
  requestApi: (abortController?: AbortController) => Promise<R>,
) {
  // 직전에 API 호출이 있었다면, 직전 호출 취소!
  requestControls.abortRequest(id)
  // 첫 API호출 시 AbortController 세팅
  requestControls.allowRequest(id)

  const stateById = useItemInteractionStateById(id)
  const result = await requestApi(stateById.abortController ?? undefined)
  if (result.id !== id) throw new AppError('Unknown')

  // 정상 응답처리 시, AbortController 제거
  requestControls.removeControl(id)
  return result
}
