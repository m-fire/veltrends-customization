import { useCallback, useRef } from 'react'
import { likeItem, unlikeItem } from '~/core/api/items'
import { ItemStatus } from '~/core/api/types'
import {
  OverrideItemState,
  useOverrideItemSetter,
} from '~/core/hook/store/useOverrideItemStore'
import AppError from '~/common/error/AppError'

export function useLikeItemAction() {
  const storeSetter = useOverrideItemSetter()

  // Item ID 별로 반복요청 취소를 위한 AbortController 관리용 MapRef
  // MDN AbortController ref: https://developer.mozilla.org/ko/docs/Web/API/AbortController
  const abortControllerMap = useRef<Map<number, AbortController>>(
    new Map(),
  ).current

  const like = useCallback(
    async ({ itemId, prevItemStatus }: LikeItemActionParams) => {
      try {
        await applyLikeAction({
          apiCaller: likeItem,
          targetInfo: { itemId },
          overrideState: {
            itemStatus: {
              ...prevItemStatus,
              likeCount: prevItemStatus.likeCount + 1,
            },
            isLiked: true,
          },
        })
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [storeSetter, abortControllerMap],
  )

  const unlike = useCallback(
    async ({ itemId, prevItemStatus }: UnlikeItemActionParams) => {
      try {
        await applyLikeAction({
          apiCaller: unlikeItem,
          targetInfo: { itemId },
          overrideState: {
            itemStatus: {
              ...prevItemStatus,
              likeCount: prevItemStatus.likeCount - 1,
            },
            isLiked: false,
          },
        })
      } catch (e) {
        // todo: handler error...
        console.error(e)
      }
    },
    [storeSetter, abortControllerMap],
  )

  return { likeItem: like, unlikeItem: unlike }

  /**
   * 사용자가 like API 요청->응답 중간에 like 를 여러번 재요청 할 경우,
   * API 반복호출을 막고, 첫번째 요청에 대한 결과만 반영.
   * 참고: Axios cancel 이 더 나은 방법일 수 있다.
   */
  async function applyLikeAction({
    apiCaller,
    targetInfo: { itemId },
    overrideState,
  }: ApplyLikeActionParams) {
    // 직전에 API 호출이 있었다면, 직전 호출 취소!
    const prevController = abortControllerMap.get(itemId)
    prevController?.abort()

    // 첫 API호출 시 AbortController 세팅
    const controller = new AbortController()
    abortControllerMap.set(itemId, controller)
    // action 모델 초기화
    storeSetter(itemId, { ...overrideState })
    const result = await apiCaller(itemId, controller)

    if (result.id !== itemId) throw new AppError('Unknown')

    // 호출직후, 등록된 AbortController 제거 및 action 모델에 변경값 적용
    abortControllerMap.delete(itemId)
    storeSetter(itemId, {
      itemStatus: result.itemStatus,
      isLiked: overrideState.isLiked,
    })
  }
}

// types

type ApplyLikeActionParams = {
  apiCaller: typeof likeItem | typeof unlikeItem
  targetInfo: TargetInfo
  overrideState: OverrideItemState
}

type TargetInfo = {
  itemId: number
}

type LikeItemActionParams = TargetInfo & {
  prevItemStatus: ItemStatus
}

type UnlikeItemActionParams = LikeItemActionParams
