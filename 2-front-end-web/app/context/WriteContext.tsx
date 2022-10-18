import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

type WriteContextMap = {
  state: { url: string }
  actions: {
    setUrl: (url: string) => void
    reset: () => void
  }
}

const WriteContext = createContext<WriteContextMap | null>(null)

interface WriteProviderProps {
  children: ReactNode
}

export function WriteContextProvider({ children }: WriteProviderProps) {
  const [state, setState] = useState<WriteContextMap['state']>({
    url: '',
  })
  const actions: WriteContextMap['actions'] = useMemo(
    () => ({
      reset() {
        setState({
          url: '',
        })
      },
      setUrl(url: string) {
        setState((prev) => ({ ...prev, url }))
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
