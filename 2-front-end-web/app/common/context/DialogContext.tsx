import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import Dialog, { DialogProps } from '~/common/component/system/Dialog'

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
    config?.onConfirm?.()
    setVisible(false)
  }, [config])

  const description = config?.description
  const value = { open }
  return (
    <DialogContext.Provider value={value}>
      {children}
      {/* 다이얼로그 창을 모든 하위컨탠츠 위에 랜더링 */}
      <Dialog
        description={{
          title: description?.title ?? '',
          description: description?.description ?? '',
          // confirmText: description?.confirmText ?? '',
          // cancelText: description?.cancelText ?? '',
        }}
        onClose={close}
        onConfirm={confirm}
        visible={visible}
        mode={config?.mode ?? 'OK'}
      />
    </DialogContext.Provider>
  )
}

export function getDialogContext() {
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

export type DialogConfig = Omit<DialogProps, 'onClose' | 'visible'> &
  Partial<Pick<DialogProps, 'onConfirm' | 'onClose'>> & {
    mode?: 'OK' | 'YESNO'
  }
