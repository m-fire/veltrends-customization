import React from 'react'
import { SpeechBubble } from '~/core/component/generate/svg'
import SequenceElementsToggler, {
  SequenceElementsTogglerProps,
} from '~/common/component/system/SequenceElementsToggler'

type ReplyButtonProps = Pick<SequenceElementsTogglerProps, 'size' | 'onClick'>

function ReplyButton({ size = 'medium', onClick }: ReplyButtonProps) {
  return (
    <SequenceElementsToggler
      elements={[<SpeechBubble />]}
      size={size}
      onClick={onClick}
    />
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
