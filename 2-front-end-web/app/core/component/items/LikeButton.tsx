import React from 'react'
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
