import { useCallback, useRef } from 'react'
import { useItemOverride } from '~/common/context/ItemStatusContext'
import { likeItem, LikeItemResult, unlikeItem } from '~/common/api/items'
import { ItemStatus } from '~/common/api/types'

export function useItemLikeActions() {
  const { actions } = useItemOverride()

  // Item ID 별로 반복요청 취소를 위한 AbortController 관리용 MapRef
  // MDN AbortController ref: https://developer.mozilla.org/ko/docs/Web/API/AbortController
  const abortControllerByIds = useRef<Map<number, AbortController>>(
    new Map(),
  ).current

  const like = useCallback(
    async (itemId: number, initialStatus: ItemStatus) => {
      try {
        await applyLikeItemResult({
          itemId,
          initialStatus: {
            ...initialStatus,
            likeCount: initialStatus.likeCount + 1,
          },
          isLiked: true,
          apiCaller: likeItem,
        })
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [actions, abortControllerByIds],
  )

  const unlike = useCallback(
    async (itemId: number, initialStatus: ItemStatus) => {
      try {
        await applyLikeItemResult({
          itemId,
          initialStatus: {
            ...initialStatus,
            likeCount: initialStatus.likeCount - 1,
          },
          isLiked: false,
          apiCaller: unlikeItem,
        })
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [actions, abortControllerByIds],
  )

  return { like, unlike }

  /**
   * 사용자가 like API 요청->응답 중간에 like 를 여러번 재요청 할 경우,
   * API 반복호출을 막고, 첫번째 요청에 대한 결과만 반영.
   * 참고: Axios cancel 이 더 나은 방법일 수 있다.
   */
  async function applyLikeItemResult({
    itemId,
    initialStatus,
    isLiked,
    apiCaller,
  }: ApplyLikeItemResultParams) {
    // 직전에 API 호출이 있었다면, 직전 호출 취소!
    const prevController = abortControllerByIds.get(itemId)
    prevController?.abort()

    // 첫 API호출 시 AbortController 세팅
    const newController = new AbortController()
    abortControllerByIds.set(itemId, newController)
    // action 모델 초기화
    actions.set(itemId, { itemStatus: initialStatus, isLiked })
    const result = await apiCaller(itemId, newController)

    // 호출직후, 등록된 AbortController 제거 및 action 모델에 변경값 적용
    abortControllerByIds.delete(itemId)
    actions.set(itemId, { itemStatus: result.itemStatus, isLiked })
  }
} // end useItemLikeActions()

// types

type ApplyLikeItemResultParams = {
  itemId: number
  initialStatus: ItemStatus
  apiCaller: (...args: any[]) => Promise<LikeItemResult>
  isLiked: boolean
}
