import React from 'react'
import { SpeechBubble } from '~/core/component/generate/svg'
import SequenceElementsToggler, {
  SequenceElementsTogglerProps,
} from '~/common/component/atom/SequenceElementsToggler'

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
