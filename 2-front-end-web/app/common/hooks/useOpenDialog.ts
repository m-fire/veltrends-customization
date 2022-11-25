import { useLocation, useNavigate } from '@remix-run/react'
import { useCallback } from 'react'
import { DialogConfig, getDialogContext } from '~/common/context/DialogContext'
import { DialogProps } from '~/components/system/Dialog'

const textConfigMap = {
  'LIKE_ITEM>>LOGIN': <DialogProps['textConfig']>{
    title: '로그인 후 이용해주세요.',
    description:
      '이 글이 마음에 드시나요? 이 글을 다른 사람들에게도 추천하기 위해서 로그인을 해주세요.',
  },
  'COMMENT_INPUT>>LOGIN': <DialogProps['textConfig']>{
    title: '로그인 후 이용해주세요.',
    description: '댓글을 작성하기 위해서 로그인을 해주세요.',
  },
  INVALID_COMMENT_LENGTH: <DialogProps['textConfig']>{
    title: '댓글 확인',
    description: '댓글은 1~300자 까지 입력이 가능합니다.',
  },
  PRIVATE_ERROR: <DialogProps['textConfig']>{
    title: '오류',
    description: '댓글 작성 실패.',
  },
}

type ConfigType = keyof typeof textConfigMap

export function useOpenDialog({ gotoLogin = false }: UseOpenDialogParams = {}) {
  const location = useLocation()
  const navigate = useNavigate()
  const gotoLoginPage = () => navigate(`/auth/login?next=${location.pathname}`)

  const { open } = getDialogContext()
  const openDialog = useCallback(
    (type: ConfigType, options: OpenFnParams = {}) => {
      const { mode = 'YESNO', onConfirm = () => {} } = options
      const textConfig = textConfigMap[type]

      open({
        textConfig,
        onConfirm: gotoLogin ? gotoLoginPage : onConfirm,
        mode: mode ?? 'YESNO',
      })
    },
    [location, navigate, open],
  )
  return openDialog
}

type UseOpenDialogParams = {
  gotoLogin?: boolean
}

type OpenFnParams = {
  mode?: DialogConfig['mode']
  onConfirm?: () => void
}
