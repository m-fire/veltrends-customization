import React, { MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'
import { motion } from 'framer-motion'
import SpeechBubble from '~/core/component/generate/svg/SpeechBubble'
import { flexStyles } from '~/common/style/styled'

type ReplyButtonProps = {
  size?: Size
  onClick?: MouseEventHandler<HTMLButtonElement>
}

function ReplyButton({ size = 'medium', onClick }: ReplyButtonProps) {
  /* Todo: LikeButton 의 코드에서 복사 후 약간의 수정하고 재사용 했으므로, 향후 중복제거 요망! */
  return (
    <StyledButton onClick={onClick} size={size}>
      <StyledSpeechBubble />
    </StyledButton>
  )
}
export default ReplyButton

// Inner Components

const StyledButton = styled.button<{ size: Size }>`
  ${flexStyles({ display: 'inline-flex', justifyContent: 'flex-start' })};
  gap: 4px;
  position: relative;
  ${({ size }) => {
    let fontSize = 14
    let iconSize = 20
    if (size === 'small') {
      fontSize = 12
      iconSize = 18
    }
    if (size === 'large') {
      fontSize = 16
      iconSize = 28
    }
    return css`
      font-size: ${fontSize}px;
      width: ${iconSize}px;
      height: ${iconSize}px;
    `
  }};
      
}

  svg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  span {
    display: inline-block;
  }
`

const MotionWrapper = styled(motion.span)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`

const StyledSpeechBubble = styled(SpeechBubble)`
  //color: ${colors.grey2};
`

// types

type Size = 'small' | 'medium' | 'large'
