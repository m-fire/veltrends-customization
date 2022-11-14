import { useLocation, useNavigate } from '@remix-run/react'
import { useCallback } from 'react'
import { getDialogContext } from '~/context/DialogContext'
import { DialogProps } from '~/components/system/Dialog'

const textConfigMap = {
  'LIKE_ITEM-LOGIN': <DialogProps['textConfig']>{
    title: '로그인 후 이용해주세요.',
    description:
      '이 글이 마음에 드시나요? 이 글을 다른 사람들에게도 추천하기 위해서 로그인을 해주세요.',
    confirmText: '로그인',
  },
}

export function useOpenDialog() {
  const location = useLocation()
  const navigate = useNavigate()
  const { open } = getDialogContext()

  const openDialog = useCallback(
    (type: keyof typeof textConfigMap) => {
      const textConfig = textConfigMap[type]
      open({
        textConfig,
        onConfirm: () => navigate(`/auth/login?next=${location.pathname}`),
      })
    },
    [location, navigate, open],
  )
  return openDialog
}
