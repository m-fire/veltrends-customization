import {
  ChangeEventHandler,
  FocusEventHandler,
  FormEvent,
  FormEventHandler,
  RefCallback,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type ValidateMode = 'all' | 'change' | 'submit' | 'blur'

type UseFormParams<K extends string> = {
  mode?: ValidateMode
  inputs: Record<K, FormInputConfig>
  initialValues?: InputValues<K>
  shouldPreventDefault?: boolean
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
export function useForm<InputName extends string>({
  mode = 'submit',
  inputs,
  initialValues,
  shouldPreventDefault,
}: UseFormParams<InputName>) {
  const [errors, setErrors] = useState(<UseFormErrorMap<InputName>>{})
  const errorsRef = useRef(errors)
  const setError = useCallback(
    (name: InputName, error: string | null | undefined) => {
      if (errorsRef.current[name] === error) return
      errorsRef.current[name] = error
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }))
    },
    [],
  )

  const inputElementsRef = useRef(<Record<InputName, HTMLInputElement>>{})

  const inputProps = useMemo(() => {
    const initialProps = {} as InputProps<InputName>
    const configByNameEntries = <[InputName, FormInputConfig][]>(
      Object.entries(inputs)
    )

    configByNameEntries.forEach(([name, inputConfig]) => {
      const { validate, errorMessage } = inputConfig
      const handleValidation = (text: string) => {
        if (validate == null) return
        const errorMessageOrNull = validate(text)
          ? null
          : errorMessage ?? DEFAULT_VALIDATE_ERROR_MESSAGE
        setError(name, errorMessageOrNull)
      }

      const { onChange: postOnChange, onBlur: postOnBlur } = inputConfig
      initialProps[name] = {
        onChange: (e) => {
          postOnChange?.(e)
          const modes: ValidateMode[] = ['change', 'all']
          if (!modes.includes(mode)) return
          handleValidation(e.target.value)
        },
        onBlur: (e) => {
          postOnBlur?.(e)
          const modes: ValidateMode[] = ['blur', 'all']
          if (!modes.includes(mode)) return
          handleValidation(e.target.value)
        },
        name,
        ref: (inputEl: HTMLInputElement) => {
          inputElementsRef.current[name] = inputEl
        },
      }
    })

    return initialProps
  }, [mode, setError, inputs])

  const handleSubmit: HandleSubmitFn<InputName> = useCallback(
    (onSubmit) => {
      return (e) => {
        const formData = new FormData(e.currentTarget)
        const valueByNames = <InputValues<InputName>>(
          Object.fromEntries(formData)
        )
        const valueByNameEntries = Object.entries(valueByNames) as [
          InputName,
          string,
        ][]

        const isValid = valueByNameEntries.reduce(
          (isValid, [name, inputValue]) => {
            const { validate, errorMessage } = inputs[name]
            if (validate?.(inputValue) === true) return isValid

            setError(name, errorMessage ?? DEFAULT_VALIDATE_ERROR_MESSAGE)
            return false
          },
          true,
        )

        if (!isValid) return e.preventDefault()

        if (shouldPreventDefault ?? true) e.preventDefault()
        onSubmit(valueByNames, e)
      }
    },
    [shouldPreventDefault, setError, inputs],
  )

  useEffect(() => {
    const configByName = <[InputName, FormInputConfig][]>Object.entries(inputs)
    configByName.forEach(([name, config]) => {
      const initialValueOrNull =
        initialValues?.[name] ?? config?.initialValue ?? null
      const inputEl = inputElementsRef.current[name]
      if (initialValueOrNull != null && inputEl != null) {
        inputEl.value = initialValueOrNull
      }
    })
  }, [initialValues, inputs])

  return {
    inputProps,
    errors,
    handleSubmit,
    setError,
  }
}

type FormInputConfig = {
  name?: string
  validate?: (text: string) => boolean
  initialValue?: string
  errorMessage?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
}

type UseFormErrorMap<Key extends string> = Record<
  Key,
  string | undefined | null
>

type HandleSubmitFn<K extends string> = (
  onSubmit: SubmitCustomHandler<K>,
) => FormEventHandler<HTMLFormElement>

type SubmitCustomHandler<K extends string> = (
  values: InputValues<K>,
  event: FormEvent<HTMLFormElement>,
) => void

type InputValues<K extends string> = Record<K, string>

type InputProps<K extends string> = Record<
  K,
  {
    name: K
    ref?: RefCallback<HTMLInputElement> // (ref: HTMLInputElement) => void
    onChange: ChangeEventHandler<HTMLInputElement>
    onBlur: FocusEventHandler<HTMLInputElement>
  }
>

const DEFAULT_VALIDATE_ERROR_MESSAGE = 'Validation Error'
