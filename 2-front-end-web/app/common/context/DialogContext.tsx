import {
  createContext,
  JSXElementConstructor,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { DialogProps } from '~/common/component/template/Dialog'

const DialogContext = createContext<DialogActionContext | null>(null)
type DialogActionContext = { open(config: DialogConfig): void }

interface DialogContextProviderProps {
  dialog: JSXElementConstructor<DialogProps>
  overlay: DialogProps['overlay']
  children: ReactNode
}

export function DialogContextProvider({
  dialog: Dialog,
  overlay,
  children,
}: DialogContextProviderProps) {
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState<DialogConfig | null>(null)

  const onConfirm = useCallback(() => {
    config?.onConfirm?.()
    setVisible(false)
  }, [config])

  const onCancel = useCallback(() => {
    config?.onCancel?.()
    setVisible(false)
  }, [config])

  const textMap = config?.textMap
  const open = useCallback((config: DialogConfig) => {
    setVisible(true)
    setConfig(config)
  }, [])

  return (
    <DialogContext.Provider value={{ open: open }}>
      {children}
      <Dialog
        overlay={overlay}
        textMap={{
          title: textMap?.title ?? '',
          description: textMap?.description ?? '',
          confirmText: textMap?.confirmText ?? '확인',
          cancelText: textMap?.cancelText ?? '닫기',
        }}
        onConfirm={onConfirm}
        onCancel={onCancel}
        visible={visible}
        mode={config?.mode ?? 'OK'}
      />
    </DialogContext.Provider>
  )
}
export type DialogConfig = Omit<
  DialogProps,
  'overlay' | 'visible' | 'onConfirm' | 'onCancel'
> &
  Partial<Pick<DialogProps, 'onConfirm' | 'onCancel'>>

// utils

export function getDialogContext() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogContextProvider')
  }
  return context
}
