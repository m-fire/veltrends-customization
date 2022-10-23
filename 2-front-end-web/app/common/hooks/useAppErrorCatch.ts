import { ThrownResponse, useCatch } from '@remix-run/react'
import AppError from '~/common/error/AppError'

export function useAppErrorCatch() {
  const caught = useCatch<ThrownResponse<number, AppError>>()
  return caught
}
