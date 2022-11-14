import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import Dialog, { DialogProps } from '~/components/system/Dialog'

const DialogContext = createContext<DialogActions | null>(null)

interface DialogContextProviderProps {
  children: ReactNode
}

export function DialogContextProvider({
  children,
}: DialogContextProviderProps) {
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState<DialogConfig | null>(null)

  const open = useCallback((config: DialogConfig) => {
    setVisible(true)
    setConfig(config)
  }, [])
  const close = useCallback(() => {
    config?.onClose?.()
    setVisible(false)
  }, [config])
  const confirm = useCallback(() => {
    config?.onConfirm()
    setVisible(false)
  }, [config])

  const value = { open }
  const textConfig = config?.textConfig
  return (
    <DialogContext.Provider value={value}>
      {children}
      {/* 다이얼로그 창을 모든 하위컨탠츠 위에 랜더링 */}
      <Dialog
        textConfig={{
          title: textConfig?.title ?? '',
          description: textConfig?.description ?? '',
          confirmText: textConfig?.confirmText ?? '',
          cancelText: textConfig?.cancelText ?? '',
        }}
        onClose={close}
        onConfirm={confirm}
        visible={visible}
      />
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogContextProvider')
  }
  return context
}

//types

type DialogActions = {
  open(config: DialogConfig): void
}

type DialogConfig = Omit<DialogProps, 'onClose' | 'visible'> &
  Partial<Pick<DialogProps, 'onClose'>>
