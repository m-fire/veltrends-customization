import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { useQueryClient } from '@tanstack/react-query'
import Overlay from '../system/Overlay'
import useCommentInputStore from '~/common/hooks/store/useCommentInputStore'
import { SpeechBubble } from '~/components/generate/svg'
import { colors } from '~/common/style/colors'
import { useEffect, useState } from 'react'
import Spinner from '~/components/system/Spinner'
import { useItemIdParams } from '~/common/hooks/useItemIdParams'
import { useCreateCommentMutation } from '~/common/hooks/mutation/useCreateCommentMutation'
import { getCommentListQueryKey } from '~/common/hooks/query/useCommentListQuery'
import { Comment } from '~/common/api/types'
import produce from 'immer'
import { useOpenDialog } from '~/common/hooks/useOpenDialog'
import useFocus from '~/common/hooks/useFocus'
import { flexStyles, fontStyles } from '~/common/style/styled'

type CommentInputOverlayParams = {}

function CommentInputOverlay({}: CommentInputOverlayParams) {
  // react-query Store 설정
  const closeCommentInput = useCommentInputStore((store) => store.action.close)
  const parentCommentId = useCommentInputStore(
    (store) => store.state.parentCommentId,
  )
  const queryClient = useQueryClient()
  const itemId = useItemIdParams()
  const openDialog = useOpenDialog()
  const commentsMutation = useCreateCommentMutation({
    async onSuccess(commentData) {
      if (!itemId) return

      const commentListKey = getCommentListQueryKey(itemId)
      queryClient.setQueryData(
        commentListKey,
        (prevList: Comment[] | undefined) => {
          if (prevList == null) return undefined
          if (parentCommentId == null) return prevList.concat(commentData)

          const updatedList = produce(prevList, (draft) => {
            const rootComment =
              // first find from 0 level comments
              draft.find((c) => c.id === parentCommentId) ??
              // next, find from subcommentList
              draft.find((c) =>
                c.subcommentList?.find((sc) => sc.id === parentCommentId),
              )
            rootComment?.subcommentList?.push(commentData)
          })
          return updatedList
        },
      )
      await queryClient.invalidateQueries(commentListKey)

      setTimeout(() => {
        // 추가된 새 데이터 로딩완료 후 0.05 초 지연 및 추가된커맨트로 스크롤이동
        scrollToComment(commentData.id)
      }, 0)

      closeCommentInput()
    },

    onError() {
      openDialog('PRIVATE_ERROR', {
        mode: 'OK',
        onConfirm: () => focusInput(),
      })
    },
  })

  const [text, setText] = useState('')
  const visible = useCommentInputStore((store) => store.state.visible)
  useEffect(() => {
    if (visible) setText('')
  }, [visible])

  const { mutate } = commentsMutation
  const [inputRef, focusInput] = useFocus<HTMLInputElement>()
  const onReply = () => {
    if (!itemId) return

    const trimText = text.trim()
    if (trimText.length <= 0 || trimText.length > 300) {
      openDialog('INVALID_COMMENT_LENGTH', {
        mode: 'OK',
        onConfirm: () => focusInput(),
      })
      return
    }

    mutate({
      itemId,
      parentCommentId: parentCommentId ?? undefined,
      text: trimText,
    })
  }

  const { isLoading } = commentsMutation
  return (
    <>
      <Overlay onClick={closeCommentInput} visible={visible} />
      <AnimatePresence initial={false}>
        {visible && (
          <Footer
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{
              damping: 0 /* 에니메이션 제동 */,
            }}
          >
            <StyledInput
              autoFocus
              ref={inputRef}
              value={text}
              placeholder="댓글을 입력하세요"
              onChange={(e) => setText(e.target.value)}
            />
            <TransparentButton onClick={onReply} disabled={isLoading}>
              {isLoading ? <StyledSpinner /> : <StyledSpeechBubble />}
            </TransparentButton>
          </Footer>
        )}
      </AnimatePresence>
    </>
  )

  function scrollToComment(commentId: number) {
    const commentContainerEl = document.body.querySelector<HTMLDivElement>(
      `[data-comment-id="${commentId}"]`,
    )
    if (!commentContainerEl) return
    commentContainerEl.scrollIntoView()
  }
}
export default CommentInputOverlay

// Inner components

const Footer = styled(motion.div)`
  ${flexStyles({ alignItems: 'center' })};
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 48px;
  background: white;
  padding: 2px 2px;
`

const StyledInput = styled.input`
  flex: 1;
  ${fontStyles({ size: '16px', weight: 400 })};
  height: 100%;
  border: none;
  padding: 0 20px;
  &::placeholder {
    color: ${colors.grey1};
  }
`

const TransparentButton = styled.button`
  ${flexStyles({ alignItems: 'center', justifyContent: 'center' })};
  height: 100%;
  padding: 0 8px;
  position: relative;
`

const StyledSpeechBubble = styled(SpeechBubble)`
  width: 24px;
  height: 24px;
  color: ${colors.primary1};
`

const StyledSpinner = styled(Spinner)`
  width: 24px;
  height: 24px;
  color: ${colors.primary1};
`
