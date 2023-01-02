import React from 'react'
import { HeartFill, HeartOutline } from '~/core/component/generate/svg'
import SequenceElementsToggler, {
  SequenceElementsTogglerProps,
} from '~/common/component/system/SequenceElementsToggler'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'

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
      elements={[<StyledHeartOutline />, <HeartFill />]}
      startIndex={isLiked ? 1 : 0}
      size={size}
      disabled={disabled}
      onClick={onClick}
    />
  )
}
export default LikeButton

// Inner Components

const StyledHeartOutline = styled(HeartOutline)`
  color: ${colors.grey2};
`
