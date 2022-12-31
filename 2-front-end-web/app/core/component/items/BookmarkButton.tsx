import React from 'react'
import { Bookmarks } from '~/core/component/generate/svg'
import SequenceElementsToggler, {
  SequenceElementsTogglerProps,
} from '~/common/component/system/SequenceElementsToggler'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'

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
      elements={[StyledBookmarksOutline, StyledBookmarksFill]}
      startIndex={isBookmarked ? 1 : 0}
      size={size}
      disabled={disabled}
      onClick={onClick}
    />
  )
}
export default BookmarkButton

// Inner Components

const StyledBookmarksFill = styled(Bookmarks)`
  color: ${colors.grey4};
`
const StyledBookmarksOutline = styled(Bookmarks)`
  color: ${colors.primary1};
`
