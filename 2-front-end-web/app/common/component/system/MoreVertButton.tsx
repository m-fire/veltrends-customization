import React from 'react'
import styled, { css } from 'styled-components'
import { MoreVert } from '~/core/component/generate/svg'
import { colors } from '~/common/style/colors'
import Flex from '~/common/style/css-flex'

type MoreVertButtonProps = {
  position?: PositionType
  onClick: () => void
}

function MoreVertButton({ position = 'item', onClick }: MoreVertButtonProps) {
  return (
    <StyledButton position={position} onClick={onClick}>
      <MoreVert />
    </StyledButton>
  )
}

export default MoreVertButton

// Inner Components

const StyledButton = styled.button<Pick<MoreVertButtonProps, 'position'>>`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  ${({ position }) => variantStyles[position!]}
  svg {
    width: 20px;
    height: 20px;
  }
`

const variantStyles: Record<PositionType, ReturnType<typeof css>> = {
  header: css`
    padding: 8px;
    margin-right: -8px;
  `,
  item: css`
    width: 40px;
    height: 40px;
    color: ${colors.grey5};
    margin-right: -8px;
  `,
}

// types

type PositionType = 'header' | 'item'
