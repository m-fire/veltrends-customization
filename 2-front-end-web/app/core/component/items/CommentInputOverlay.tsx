import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import produce from 'immer'
import { useQueryClient } from '@tanstack/react-query'
import AppOverlay from '../home/AppOverlay'
import Spinner from '~/core/component/Spinner'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import { SpeechBubble, Write } from '~/core/component/generate/svg'
import { useItemIdParams } from '~/core/hook/useItemIdParams'
import { commentsKey } from '~/core/hook/query/useCommentsQuery'
import { Comment } from '~/core/api/types'
import {
  useCreateCommentMutation,
  useEditCommentMutation,
} from '~/core/hook/mutation/useCommentsMutation'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import useFocus from '~/common/hook/useFocus'
import { useCommentInputState } from '~/core/hook/store/useCommentActionStore'
import { useCommentInputAction } from '~/core/hook/useCommentAction'
import { Flex, Font } from '~/common/style/css-builder'

type CommentInputOverlayParams = {}

function CommentInputOverlay({}: CommentInputOverlayParams) {
  // react-query Store 설정
  const { closeInput: closeInputModal } = useCommentInputAction()
  const inputState = useCommentInputState()

  const openDialog = useOpenDialog()
  const queryClient = useQueryClient()
  const itemId = useItemIdParams()
  const createMutation = useCreateCommentMutation({
    onSuccess: async (commentData) => {
      if (itemId == null) return

      const { parentCommentId } = inputState
      const queryKey = commentsKey(itemId)
      queryClient.setQueryData(queryKey, (prevList: Comment[] | undefined) => {
        if (prevList == null) return undefined
        if (parentCommentId == null) return prevList.concat(commentData)

        const editedList = produce(prevList, (draft) => {
          const rootComment =
            // first find from 0 level comments
            draft.find((c) => c.id === parentCommentId) ??
            // next, find from subcommentList
            draft.find((c) =>
              c.subcommentList?.find((sc) => sc.id === parentCommentId),
            )
          rootComment?.subcommentList?.push(commentData)
        })

        return editedList
      })
      await queryClient.invalidateQueries(queryKey)

      setTimeout(() => {
        // 추가된 새 데이터 로딩완료 후 0.05 초 지연 및 추가된커맨트로 스크롤이동
        scrollToComment(commentData.id)
      }, 0)
      closeInputModal()
    },
    onError: () => {
      openDialog('PRIVATE_ERROR', {
        mode: 'OK',
        onConfirm: () => focusInput(),
      })
    },
  })

  const editMutaiton = useEditCommentMutation({
    onSuccess: async () => {
      if (itemId == null) return
      await queryClient.invalidateQueries(commentsKey(itemId))
      closeInputModal()
    },
    onError: () => {
      openDialog('COMMENT_EDIT_ERROR', {
        mode: 'OK',
      })
    },
  })

  const [text, setText] = useState('')
  const [inputRef, focusInput] = useFocus<HTMLInputElement>()
  const onReply = () => {
    if (itemId == null) return

    const trimedText = text.trim()
    if (trimedText.length === 0) {
      openDialog('INVALID_COMMENT_LENGTH', {
        mode: 'OK',
        onConfirm: () => focusInput(),
      })
      return
    }

    const { commentId } = inputState
    if (commentId != null) {
      const { mutate: editComment } = editMutaiton
      editComment({
        itemId,
        commentId,
        text: trimedText,
      })
      return
    }

    const { parentCommentId } = inputState
    const { mutate: writeComment } = createMutation
    writeComment({
      itemId,
      parentCommentId: parentCommentId ?? undefined,
      text: trimedText,
    })
  }

  const { visible, commentId, inputValue: inputModalText } = inputState
  useEffect(() => {
    if (visible) setText('')
  }, [visible])

  useEffect(() => {
    if (inputModalText !== '') setText(inputModalText)
  }, [inputModalText])

  const isCommentSending = createMutation.isLoading || editMutaiton.isLoading
  const isCreateComment = commentId == null

  return (
    <>
      <AppOverlay onClick={closeInputModal} visible={visible} />
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
            <TransparentButton onClick={onReply} disabled={isCommentSending}>
              {isCommentSending ? (
                <StyledSpinner />
              ) : isCreateComment ? (
                <StyledSpeechBubble />
              ) : (
                <StyledWrite />
              )}
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
  ${Flex.container().alignItems('center').create()};
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 48px;
  background: white;
  padding: 2px 2px;
`

const StyledInput = styled.input`
  ${Flex.item().flex(1).create()};
  ${Font.style().size(16).weight(400).create()};
  height: 100%;
  border: none;
  padding: 0 20px;
  &::placeholder {
    color: ${globalColors.grey1};
  }
`

const TransparentButton = styled.button`
  ${Flex.container().alignItems('center').justifyContent('center').create()};
  height: 100%;
  padding: 0 8px;
  position: relative;
`

const StyledSpeechBubble = styled(SpeechBubble)`
  width: 24px;
  height: 24px;
  color: ${appColors.primary1};
`

const StyledWrite = styled(Write)`
  width: 20px;
  height: 20px;
  color: ${appColors.primary1};
`

const StyledSpinner = styled(Spinner)`
  width: 24px;
  height: 24px;
  color: ${appColors.primary1};
`
