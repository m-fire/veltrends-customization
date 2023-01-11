import React from 'react'
import { Bookmarks } from '~/core/component/generate/svg'
import SequenceElementsToggler, {
  SequenceElementsTogglerProps,
} from '~/common/component/atom/SequenceElementsToggler'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'

type BookmarkButtonProps = {
  isBookmarked?: boolean
} & Pick<SequenceElementsTogglerProps, 'size' | 'onClick' | 'disabled'>

function BookmarkButton({
  isBookmarked,
  size = 'medium',
  onClick,
  disabled = false,
}: BookmarkButtonProps) {
  return (
    <SequenceElementsToggler
      elements={[<DeactiveBookmark />, <ActiveBookmark />]}
      startIndex={isBookmarked ? 1 : 0}
      size={size}
      disabled={disabled}
      onClick={onClick}
    />
  )
}
export default BookmarkButton

// Inner Components

const ActiveBookmark = styled(Bookmarks)`
  color: ${appColors.primary1};
`

const DeactiveBookmark = styled(Bookmarks)`
  color: ${globalColors.grey2};
`
