import React from 'react'
import styled, { css } from 'styled-components'
import { MoreVert } from '~/core/component/generate/svg'
import { globalColors } from '~/common/style/global-colors'
import IconButton from '~/common/component/atom/IconButton'

type MoreVertButtonProps = {
  position?: PositionType
  onClick: () => void
}
type PositionType = 'header' | 'item'

function MoreVertButton({ position = 'item', onClick }: MoreVertButtonProps) {
  return (
    <StyledIconButton
      position={position}
      onClick={onClick}
      icon={<MoreVert />}
    />
  )
}

export default MoreVertButton

// Inner Components

const StyledIconButton = styled(IconButton)<MoreVertButtonProps>`
  color: ${globalColors.grey5};
  ${({ position }) => position && variantStyles[position]}
`

const variantStyles: Record<PositionType, ReturnType<typeof css>> = {
  header: css`
    padding: 8px;
    margin-right: -8px;
  `,
  item: css`
    width: 40px;
    height: 40px;
    color: ${globalColors.grey5};
    margin-right: -8px;
  `,
}
