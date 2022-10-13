import { useTransition } from '@remix-run/react'

export function useSubmitLoading() {
  /*
   * Remix `transition` types
   *     - idle: 아무런 작업이 없는 상태
   *     - submitting: 데이터쓰기 요청이 진행중
   *     - loading: 데이터쓰기 후 useLoaderData 의 데이터 불러오는중
   *
   * HTTP Method 별 transition type 변경 흐름
   *     - normal, GET: idle -> loading -> idel
   *     - POST,PUT,PATCH or DELETE: idle -> submitting -> loading -> idel
   * */
  const transition = useTransition()
  // 단순한 loading state 처리를 위해 두가지 transition 상태를 `loading` 상태로 간주한다.
  return ['submitting', 'loading'].includes(transition.state)
}
