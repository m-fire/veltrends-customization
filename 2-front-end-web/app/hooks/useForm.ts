import { FocusEventHandler } from 'react'

interface InputConfig {
  initaialValue: string
  validate(value: string): boolean
}

interface InputProps {
  name: string
  onBlur: FocusEventHandler<HTMLInputElement>
}

type UseFormParams<K extends string> = Record<K, InputConfig>
type UseFormResult<K extends string> = Record<K, InputProps>

/**
 * 훅 사용예시
 * useForm({
 *   username: {
 *     initialValue: '',
 *     validate: (v: string) => {},
 *   },
 *   password: {
 *     initialValue: '',
 *     validate: (v: string) => {},
 *   },
 * })
 */
export function useForm<K extends string>(params: UseFormParams<K>) {
  const result: Partial<UseFormResult<K>> = {}
  return result as UseFormResult<K>
}
