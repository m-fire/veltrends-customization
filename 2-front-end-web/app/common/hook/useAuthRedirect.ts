import { useEffect } from 'react'
import { useActionData, useNavigate, useSearchParams } from '@remix-run/react'
import { CatchValue } from '@remix-run/react/dist/transition'
import { AuthResult } from '~/core/api/auth'

export function useAuthRedirect() {
  const resultOrError = useActionData<AuthResult | CatchValue>()

  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') ?? '/'
  const navigate = useNavigate()

  useEffect(() => {
    if (!resultOrError) return
    if ('status' in resultOrError) return // login failed

    navigate(next)
  }, [resultOrError, navigate, next])
}
