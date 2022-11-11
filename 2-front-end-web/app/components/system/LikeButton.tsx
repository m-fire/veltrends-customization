import React, { MouseEventHandler, ReactNode } from 'react'
import styled from 'styled-components'
import { HeartFill, HeartOutline } from '~/components/generate/svg'
import { colors } from '~/common/style/colors'
import { AnimatePresence, motion } from 'framer-motion'

type LikeButtonProps = {
  onClick: MouseEventHandler
  isLiked: boolean
}

function LikeButton({ onClick, isLiked }: LikeButtonProps) {
  return (
    <StyledButton onClick={onClick}>
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

/* Wrap styled from SVG Components */

const StyledHeartFill = styled(HeartFill)`
  //color: ${colors.primary1};
`

const StyledHeartOutline = styled(HeartOutline)`
  color: ${colors.grey2};
`

// Inner Components
