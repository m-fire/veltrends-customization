import React, { JSXElementConstructor, ReactNode, SVGProps } from 'react'
import { NavLink, NavLinkProps } from '@remix-run/react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { RoutePath } from '~/common/api/client'
import { Flex, Font } from '~/common/style/css-builder'

export type IconNavLinkProps = {
  to: RoutePath
  icon: ReactNode
} & NavLinkProps

function IconNavLink({ to, icon, ...rest }: IconNavLinkProps) {
  return (
    <StyledNavLink {...rest} to={to}>
      {icon}
    </StyledNavLink>
  )
}
export default IconNavLink

// Inner Components

const StyledNavLink = styled(NavLink)`
  ${Flex.item().flex(1).create()};
  ${Flex.container().alignItems('center').justifyContent('center').create()};
  position: relative;
  svg {
    color: ${globalColors.grey5};
    width: 24px;
    height: 24px;
  }
`
