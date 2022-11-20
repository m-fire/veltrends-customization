import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { motion } from 'framer-motion'
import SpeechBubble from '~/components/generate/svg/SpeechBubble'

type CommentButtonProps = {
  onClick: MouseEventHandler
}

function CommentButton({ onClick }: CommentButtonProps) {
  return (
    <StyledButton onClick={onClick}>
      <StyledSpeechBubble />
    </StyledButton>
  )
}
export default CommentButton

const StyledButton = styled.div`
  padding: 0;
  border: none;
  outline: none;
  background: none;
  width: 24px;
  height: 24px;
  position: relative;
  svg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
`

const MotionWrapper = styled(motion.span)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`

// Inner Components

const StyledSpeechBubble = styled(SpeechBubble)`
  color: ${colors.grey2};
`
