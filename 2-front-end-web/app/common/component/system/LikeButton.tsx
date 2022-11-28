import React, { MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'
import { HeartFill, HeartOutline } from '~/core/component/generate/svg'
import { colors } from '~/common/style/colors'
import { AnimatePresence, motion } from 'framer-motion'
import { flexStyles } from '~/common/style/styled'

type LikeButtonProps = {
  isLiked?: boolean
  size?: Size
  onClick?: MouseEventHandler<HTMLButtonElement>
}

function LikeButton({ isLiked, size = 'medium', onClick }: LikeButtonProps) {
  return (
    <StyledButton size={size} onClick={onClick}>
      <AnimatePresence initial={false}>
        {isLiked ? (
          <MotionWrapper
            key="fill"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <StyledHeartFill key="fill" />
          </MotionWrapper>
        ) : (
          <MotionWrapper
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <StyledHeartOutline key="outline" />
          </MotionWrapper>
        )}
      </AnimatePresence>
    </StyledButton>
  )
}
export default LikeButton

// Inner Components

const StyledButton = styled.button<{ size: Size }>`
  ${flexStyles({ display: 'inline-flex' })};
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

/* Wrap styled from SVG Components */

const StyledHeartFill = styled(HeartFill)`
  //color: ${colors.primary1};
`

const StyledHeartOutline = styled(HeartOutline)`
  //color: ${colors.grey2};
`

// types

type Size = 'small' | 'medium' | 'large'
