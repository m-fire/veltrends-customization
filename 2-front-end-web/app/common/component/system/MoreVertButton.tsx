import React, { MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'
import { MoreVert } from '~/core/component/generate/svg'
import { colors } from '~/common/style/colors'
import { flexStyles } from '~/common/style/styled'

type MoreVertButtonProps = {
  position?: 'header' | 'comment'
  onClick: () => void
}

function MoreVertButton({ position, onClick }: MoreVertButtonProps) {
  return (
    //인식
    <StyledButton position={position} onClick={onClick}>
      <MoreVert />
    </StyledButton>
  )
}

export default MoreVertButton

// Inner Components

const StyledButton = styled.button<{
  position: MoreVertButtonProps['position']
}>`
  ${flexStyles({ alignItems: 'center', justifyContent: 'center' })}
  ${({ position }) =>
    position === 'header'
      ? css`
          padding: 8px;
          margin-right: -8px;
        `
      : css`
          width: 40px;
          height: 40px;
          color: ${colors.grey5};
          margin-right: -8px;
        `}
  svg {
    width: 20px;
    height: 20px;
  }
`
