import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import AppError from '~/common/error/AppError'

const initialState = {
  form: {
    link: '',
    title: '',
    body: '',
  },
  // error: undefined,
}

const WriteContext = createContext<WriteContextMap | null>(null)

interface WriteProviderProps {
  children: ReactNode
}

export function WriteContextProvider({ children }: WriteProviderProps) {
  const [state, setState] = useState<WriteContextState>(initialState)

  const actions: WriteContextActions = useMemo(
    () => ({
      reset: () => {
        setState(initialState)
      },
      change: (key, value) => {
        setState((prev) => ({
          ...prev,
          form: {
            ...prev.form,
            [key]: value,
          },
        }))
      },
      setError: (error) => {
        setState((prev) => ({
          ...prev,
          error,
        }))
      },
    }),
    [],
  )
  const value = useMemo(() => ({ state, actions }), [state, actions])

  return <WriteContext.Provider value={value}>{children}</WriteContext.Provider>
}

export function useWriteContext() {
  const context = useContext(WriteContext)
  if (context === null) {
    throw new Error('useWriteContext must be used within a WriteProvider')
  }
  return context
}

type WriteContextMap = {
  state: WriteContextState
  actions: WriteContextActions
}

export type WriteContextState = {
  form: {
    link: string
    title: string
    body: string
  }
  error?: AppError
}

export type WriteContextActions = {
  reset(): void
  change<K extends keyof WriteContextState['form']>(
    key: K,
    value: WriteContextState['form'][K],
  ): void
  setError(error?: AppError): void
}
