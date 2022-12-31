import useAppActionStore, {
  EntityType,
} from '~/core/hook/store/useAppActionStore'
import { useMemo } from 'react'

export function useRequestControlAction<K extends EntityType>(entityType: K) {
  const { abort, remove, getController } = useAppActionStore(
    (s) => s.requestControlActions,
  )

  const requestControlAction = useMemo(
    () => ({
      //직전에 API 호출이 있었다면, 직전호출 중단 및 AbortController 재생성
      abortRequest: (entityId: number) => abort(entityType, entityId),
      //정상 응답처리 시, AbortController 제거
      removeAbortController: (entityId: number) => remove(entityType, entityId),
      getAbortController: (entityId: number) =>
        getController(entityType, entityId),
    }),
    [abort, remove, getController],
  )

  return requestControlAction
}
