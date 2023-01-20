import { useEffect } from 'react'
import { useActionData, useSearchParams } from '@remix-run/react'
import { CatchValue } from '@remix-run/react/dist/transition'
import { AuthResult } from '~/core/api/auth'

export function useAuthRedirect() {
  const resultOrError = useActionData<AuthResult | CatchValue>()

  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  useEffect(() => {
    if (!resultOrError) return
    if ('status' in resultOrError) return // login failed

    /* 인증사용자 현상유지 편의를 위해 useNavigate 을 location 으로 치환 */
    // 이 조치를 통해 인증사용자는 인증환경에서 App 을 사용하게 됨.
    window.location.href = next
  }, [resultOrError, next])
}
