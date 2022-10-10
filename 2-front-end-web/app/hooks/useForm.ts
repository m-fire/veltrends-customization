import { Validates } from '~/common/util/validates'

type FormInputConfig = {
  validate: (text: string) => boolean
  name?: string
  initialValue?: string
}

type UseFormParams<K extends string> = {
  config: Record<K, FormInputConfig>
  mode?: 'all' | 'chagne' | 'submit' | 'blur'
  initialValues?: Record<K, string>
}

/**
 * 1. validate
 *    - when -> blur change -> validate
 *    - when -> submit -> validate
 * 2. handle error message
 *    - for each input
 *    - for form
 *    - external message settings
 */
export function useForm<K extends string>(params: UseFormParams<K>) {}

// 사용예시
export function example() {
  const reuslt = useForm({
    config: {
      username: {
        validate: Validates.Auth.usrename,
      },
      password: {
        validate: Validates.Auth.password,
      },
    },
  })
}
