import React, { ReactElement, ReactFragment, ReactPortal } from 'react'
import styled from 'styled-components'
import { Flex } from '~/common/style/css-builder'

type IconButtonProps = {
  icon: ReactElement | ReactFragment | ReactPortal
  onClick?: () => void
  className?: string
  [key: string]: any
}

function IconButton({ icon, onClick, className, ...rest }: IconButtonProps) {
  return (
    <StyledButton onClick={onClick} className={className} {...rest}>
      {icon}
    </StyledButton>
  )
}
export default IconButton

const StyledButton = styled.button`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  & svg,
  & image {
    width: 20px;
    height: 20px;
  }
`
