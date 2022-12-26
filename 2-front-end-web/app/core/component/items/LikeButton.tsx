import React, { MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'
import { HeartFill, HeartOutline } from '~/core/component/generate/svg'
import SequenceElementsToggler, {
  SequenceElementsTogglerProps,
} from '~/common/component/system/SequenceElementsToggler'

type LikeButtonProps = {
  isLiked?: boolean
} & Pick<SequenceElementsTogglerProps, 'size' | 'onClick' | 'disabled'>

function LikeButton({
  size = 'medium',
  isLiked,
  onClick,
  disabled = false,
}: LikeButtonProps) {
  return (
    <SequenceElementsToggler
      elements={[<HeartOutline />, <HeartFill />]}
      firstSequence={isLiked ? 1 : 0}
      size={size}
      disabled={disabled}
      onClick={onClick}
    />
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
