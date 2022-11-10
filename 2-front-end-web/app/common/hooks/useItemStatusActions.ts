import { useCallback, useRef } from 'react'
import { useItemOverride } from '~/context/ItemStatusContext'
import { likeItem, LikeItemResult, unlikeItem } from '~/common/api/items'
import { ItemStatus } from '~/common/api/types'

export function useItemLikeActions() {
  const { actions } = useItemOverride()
  /* 사용자가 like 버튼을 다발적으로 누를경우 대비 */
  const concurrentCountRef = useRef<Map<number, number>>(new Map())

  const like = useCallback(
    async (itemId: number, initialStatus: ItemStatus) => {
      try {
        await applyLikeItemResult({
          itemId,
          initialStatus: {
            ...initialStatus,
            likes: initialStatus.likes + 1,
          },
          callApi: likeItem,
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
    async (itemId: number, initialStatus: ItemStatus) => {
      try {
        await applyLikeItemResult({
          itemId,
          initialStatus: {
            ...initialStatus,
            likes: initialStatus.likes - 1,
          },
          callApi: unlikeItem,
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

  // refactoring

  /**
   * 사용자가 like API 요청->응답 중간에 like 를 여러번 재요청 할 경우,
   * API 반복호출을 막고, 첫번째 요청에 대한 결과만 반영.
   * 참고: Axios cancel 이 더 나은 방법일 수 있다.
   */
  async function applyLikeItemResult({
    itemId,
    initialStatus,
    callApi,
    isLiked,
  }: ApplyLikeItemResultParams) {
    const usersLikeCountMap = concurrentCountRef.current
    actions.set(itemId, { itemStatus: initialStatus, isLiked })

    // 사용자의 like 요청 수 세기
    const likeCount = (usersLikeCountMap.get(itemId) ?? 0) + 1
    usersLikeCountMap.set(itemId, likeCount)

    const result = await callApi(itemId)
    if (usersLikeCountMap.get(itemId) !== likeCount) return

    actions.set(itemId, { itemStatus: result.itemStatus, isLiked })
  }
}

// types

type ApplyLikeItemResultParams = {
  itemId: number
  initialStatus: ItemStatus
  callApi: (...args: any[]) => Promise<LikeItemResult>
  isLiked: boolean
}
