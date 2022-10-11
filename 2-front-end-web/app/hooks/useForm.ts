import { Validates } from '~/common/util/validates'
import {
  ChangeEventHandler,
  FocusEventHandler,
  FormEvent,
  FormEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

type FormInputConfig = {
  initialValue?: string
  validate: (text: string) => boolean
  name?: string
  errorMessage?: string
}

type ValidateMode = 'all' | 'change' | 'submit' | 'blur'

type UseFormParams<K extends string> = {
  mode?: ValidateMode
  form: Record<K, FormInputConfig>
  initialValues?: InputValueMap<K>
  shouldPreventDefault?: boolean
}

type UseFormResult<K extends string> = {
  inputProps: InputPropRecord<K>
  handleSubmit: HandleSubmitFunction<K>
  errors: Record<K, string | undefined | null>
  formError?: Record<K, string | undefined | null>
  setError?: (name: K, error: string) => void
  setFormError?: (error: string | null) => void
}
type HandleSubmitFunction<K extends string> = (
  onSubmit: SubmitCustomHandler<K>,
) => FormEventHandler<HTMLFormElement>

type SubmitCustomHandler<K extends string> = (
  values: InputValueMap<K>,
  event: FormEvent<HTMLFormElement>,
) => void

type InputPropRecord<K extends string> = Record<K, InputProp>
type InputProp = {
  name: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur: FocusEventHandler<HTMLInputElement>
}
type InputValueMap<K extends string> = Record<K, string>

const DEFAULT_VALIDATE_MESSAGE = 'Validation Error'

/**
 * 1. validate
 *    - when -> blur change -> validate
 *    - when -> submit -> validate
 * 2. handle error message
 *    - for each input
 *    - for form
 *    - external message settings
 *
 * ex)
 * const inputProps = useForm(..)
 * <input {...inputProps.username} />
 */
export function useForm<K extends string>(
  params: UseFormParams<K>,
): UseFormResult<K> {
  //
  const initialErrors = useMemo(() => {
    const errors: Record<string, string | undefined | null> = {}
    Object.keys(params.form).forEach((name) => {
      errors[name] = undefined
    })
    return errors as Record<K, string | undefined | null>
  }, [params.form])

  const [errors, setErrors] = useState(initialErrors)
  const errorsRef = useRef(errors)
  const setError = useCallback((key: K, error: string | null | undefined) => {
    if (errorsRef.current[key] === error) return
    errorsRef.current[key] = error
    setErrors((prevErrors) => {
      return {
        ...prevErrors,
        [key]: error,
      }
    })
  }, [])

  // const inputRefs = useRef<Partial<Record<K, HTMLInputElement>>>({})

  const mode = params.mode ?? 'submit'
  const inputProps = useMemo(() => {
    const keys = Object.keys(params.form) as K[]
    const partialInputProps = {} as InputPropRecord<K>
    keys.forEach((k) => {
      const handleValidation = (text: string) => {
        setError(
          k,
          params.form[k]?.validate(text)
            ? params.form[k].errorMessage ?? DEFAULT_VALIDATE_MESSAGE
            : null,
        )
      }

      partialInputProps[k] = {
        onChange: (e) => {
          const modes: ValidateMode[] = ['change', 'all']
          if (!modes.includes(mode)) return
          handleValidation(e.target.value)
        },
        onBlur: (e) => {
          const modes: ValidateMode[] = ['blur', 'all']
          if (!modes.includes(mode)) return
          handleValidation(e.target.value)
        },
        name: k,
      }
    })
    return partialInputProps
  }, [params, mode, setError])

  const handleSubmit: HandleSubmitFunction<K> = useCallback(
    (onSubmit) => {
      return (e) => {
        const formData = new FormData(e.currentTarget)
        const formDataJSON = Object.fromEntries(formData) as Record<K, string>

        let errorCount = 0
        const keys = Object.keys(params.form) as K[]
        keys.forEach((k) => {
          if (params.form[k].validate?.(formDataJSON[k]) === false) {
            setError(k, params.form[k].errorMessage ?? DEFAULT_VALIDATE_MESSAGE)
            errorCount++
          }
        })
        if (errorCount > 0) {
          e.preventDefault()
          return
        }

        if (params.shouldPreventDefault ?? true) {
          e.preventDefault()
        }
        onSubmit(formDataJSON, e)
      }
    },
    [params, setError],
  )

  return {
    inputProps,
    errors,
    handleSubmit,
  }
}

// 사용예시
function example() {
  const { inputProps, errors } = useForm({
    form: {
      username: {
        validate: Validates.Auth.usrename,
      },
      password: {
        validate: Validates.Auth.password,
      },
    },
  })
  // ex) <UsernameInput {...inputProps.username}>
  // ex) <PasswordInput {...inputProps.password}>
}
