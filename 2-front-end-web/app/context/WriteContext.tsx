import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

type WriteContextType = {
  state: { url: string }
  actions: {
    setUrl: (url: string) => void
    reset: () => void
  }
}

const WriteContext = createContext<WriteContextType | null>(null)

interface WriteProviderProps {
  children: ReactNode
}

export function WriteProvider({ children }: WriteProviderProps) {
  const [state, setState] = useState<WriteContextType['state']>({
    url: '',
  })
  const actions: WriteContextType['actions'] = useMemo(
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
