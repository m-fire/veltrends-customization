import { useLocation, useNavigate } from '@remix-run/react'
import { useCallback } from 'react'
import { DialogConfig, getDialogContext } from '~/common/context/DialogContext'

/**
 * 2nd param `options` default value: {
 *    mode: 'YESNO'
 *    onConfirm: () => {},
 *    gotoLogin = false,
 * }
 */
export function useOpenDialog() {
  const location = useLocation()
  const navigate = useNavigate()

  const gotoLoginPage = () => navigate(`/auth/login?next=${location.pathname}`)

  const { open } = getDialogContext()
  const openDialog = useCallback(
    (
      type: DescriptionType,
      {
        mode = 'YESNO',
        buttonTexts,
        onConfirm = () => {},
        onCancel = () => {},
        gotoLogin = false,
      }: OpenDialogParams = {},
    ) => {
      const titleAndDesc = descriptionMap[type]

      open({
        textMap: { ...titleAndDesc, ...buttonTexts },
        onConfirm: gotoLogin ? gotoLoginPage : onConfirm,
        onCancel,
        mode,
      })
    },
    [location, navigate, open],
  )
  return openDialog
}
export default useOpenDialog

// messages

const descriptionMap = {
  DELETE_ITEM: {
    title: '삭제',
    description: '정말로 삭제 하시겠습니까?',
  },
  LIKE_ITEM: {
    title: '로그인 후 이용해주세요.',
    description: '이 글이 마음에 드세요? 로그인 이후 좋아요를 눌러주세요.',
  },
  BOOKMARK_ITEM: {
    title: '로그인 후 이용해주세요.',
    description: '이 글이 마음에 드세요? 로그인 이후 북마크를 눌러주세요.',
  },
  LIKE_COMMENT: {
    title: '로그인 후 이용해주세요.',
    description: '이 댓글이 마음에 드세요? 로그인 이후 좋아요를 눌러주세요.',
  },
  WRITE_COMMENT: {
    title: '로그인 후 이용해주세요.',
    description: '댓글을 작성하기 위해서 로그인을 해주세요.',
  },
  INVALID_COMMENT_LENGTH: {
    title: '댓글 확인',
    description: '댓글은 1~300자 까지 입력이 가능합니다.',
  },
  PRIVATE_ERROR: {
    title: '오류',
    description: '댓글 작성 실패.',
  },
  COMMENT_EDIT_ERROR: {
    title: '오류',
    description: '댓글 수정 실패',
  },
} as const

// types

type DescriptionType = keyof typeof descriptionMap

type OpenDialogParams = {
  mode?: DialogConfig['mode']
  buttonTexts?: Pick<DialogConfig['textMap'], 'confirmText' | 'cancelText'>
  onConfirm?: () => void
  onCancel?: () => void
  gotoLogin?: boolean
}
