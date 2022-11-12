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
  form: Record<K, FormInputConfig>
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
export function useFormValidation<InputName extends string>({
  mode = 'submit',
  form: inputsMap,
  initialValues,
  shouldPreventDefault,
}: UseFormParams<InputName>) {
  const [errors, setErrors] = useState(
    <Record<InputName, string | undefined | null>>{},
  )
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
      Object.entries(inputsMap)
    )
    configByNameEntries.forEach(([name, inputConfig]) => {
      const { onChange: postOnChange, onBlur: postOnBlur } = inputConfig
      initialProps[name] = {
        onChange: (e) => {
          postOnChange?.(e)
          const modes: ValidateMode[] = ['change', 'all']
          if (!modes.includes(mode)) return
          validateInputText(e.target.value)
        },
        onBlur: (e) => {
          postOnBlur?.(e)
          const modes: ValidateMode[] = ['blur', 'all']
          if (!modes.includes(mode)) return
          validateInputText(e.target.value)
        },
        name,
        ref: (inputEl: HTMLInputElement) => {
          inputElementsRef.current[name] = inputEl
        },
      }

      function validateInputText(text: string) {
        const { validate, errorMessage } = inputConfig
        if (!validate) return

        const errorMessageOrNull = validate(text)
          ? null
          : errorMessage ?? DEFAULT_VALIDATE_MESSAGE
        setError(name, errorMessageOrNull)
      }
    })

    return initialProps
  }, [mode, setError, inputsMap])

  const handleSubmit: HandleSubmitFn<InputName> = useCallback(
    (onSubmit) => {
      return (e) => {
        const formData = new FormData(e.currentTarget)
        const valueByNames = <InputValues<InputName>>(
          Object.fromEntries(formData)
        )
        const textByInputEntries = Object.entries(valueByNames) as [
          InputName,
          string,
        ][]

        const isValid = textByInputEntries.reduce((valid, [name, text]) => {
          const { validate, errorMessage } = inputsMap[name]
          if (validate?.(text) === true) return valid
          setError(name, errorMessage ?? DEFAULT_VALIDATE_MESSAGE)
          return false
        }, true)

        if (!isValid) {
          e.preventDefault()
          return
        }
        if (shouldPreventDefault ?? true) e.preventDefault()
        onSubmit(valueByNames, e)
      }
    },
    [shouldPreventDefault, setError, inputsMap],
  )

  useEffect(() => {
    const configByName = <[InputName, FormInputConfig][]>(
      Object.entries(inputsMap)
    )
    configByName.forEach(([name, config]) => {
      const initialValueOrNull =
        initialValues?.[name] ?? config?.initialValue ?? null
      const inputEl = inputElementsRef.current[name]
      if (initialValueOrNull != null && inputEl != null) {
        inputEl.value = initialValueOrNull
      }
    })
  }, [initialValues, inputsMap])

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

const DEFAULT_VALIDATE_MESSAGE = 'Validation Error'
