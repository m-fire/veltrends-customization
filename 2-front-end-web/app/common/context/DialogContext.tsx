import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import Dialog, { DialogProps } from '~/common/component/element/Dialog'

const DialogContext = createContext<DialogActionContext | null>(null)

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

  const confirm = useCallback(() => {
    config?.onConfirm?.()
    setVisible(false)
  }, [config])

  const cancel = useCallback(() => {
    config?.onCancel?.()
    setVisible(false)
  }, [config])

  const providerValue = { open }
  const dialogTexts = config?.textMap
  return (
    <DialogContext.Provider value={providerValue}>
      {children}
      {/* 다이얼로그 창을 모든 하위컨탠츠 위에 랜더링 */}
      <Dialog
        textMap={{
          title: dialogTexts?.title ?? '',
          description: dialogTexts?.description ?? '',
          confirmText: dialogTexts?.confirmText ?? '확인',
          cancelText: dialogTexts?.cancelText ?? '닫기',
        }}
        onConfirm={confirm}
        onCancel={cancel}
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

type DialogActionContext = {
  open(config: DialogConfig): void
}

export type DialogConfig = Omit<DialogProps, 'visible'> &
  Partial<Pick<DialogProps, 'onConfirm' | 'onCancel'>> & {
    mode?: DialogProps['mode']
  }
