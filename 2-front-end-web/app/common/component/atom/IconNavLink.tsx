import React, { ReactElement, ReactFragment, ReactPortal } from 'react'
import { NavLink, NavLinkProps } from '@remix-run/react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { RoutePath } from '~/common/api/client'
import { Flex } from '~/common/style/css-builder'

type IconNavLinkProps = {
  to: RoutePath
  icon: ReactElement | ReactFragment | ReactPortal
} & NavLinkProps

function IconNavLink({ to, icon, ...rest }: IconNavLinkProps) {
  return (
    <StyledNavLink
      to={to}
      className={
        // NavLInk 에만 존재하는 active 속성
        ({ isActive }) => (isActive ? 'active' : '')
      }
      {...rest}
    >
      {icon}
    </StyledNavLink>
  )
}
export default IconNavLink

// Inner Components

const StyledNavLink = styled(NavLink)`
  ${Flex.Item.flex1};
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  position: relative;
  svg {
    color: ${globalColors.grey5};
    width: 24px;
    height: 24px;
  }
`
