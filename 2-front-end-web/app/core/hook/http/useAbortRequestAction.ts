import useAppStore, { EntityType } from '../store/useAppStore'

export function useAbortRequestAction<K extends EntityType>(type: K) {
  const { abort, remove, getController } = useAppStore().abortRequestsActions

  const requestControlAction = {
    //직전에 API 호출이 있었다면, 직전호출 중단 및 AbortController 재생성
    abortRequest: (entityId: number) => abort(type, entityId),
    //정상 응답처리 시, AbortController 제거
    removeAbortController: (entityId: number) => remove(type, entityId),
    getAbortController: (entityId: number) => getController(type, entityId),
  }
  return requestControlAction
}
