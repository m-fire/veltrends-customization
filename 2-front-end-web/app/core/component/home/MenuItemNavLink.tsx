import React from 'react'
import styled from 'styled-components'
import { RoutePath } from '~/common/api/client'
import IconNavLink, {
  IconNavLinkProps,
} from '~/common/component/atom/IconNavLink'
import { decorateStyles, PseudoThemeType } from '~/core/style/decorate-styles'

export type MenuItemLinkProps = {
  to: RoutePath
  icon: IconNavLinkProps['icon']
  $decorateType?: PseudoThemeType
}

function MenuItemNavLink({
  to,
  icon,
  $decorateType,
  ...rest
}: MenuItemLinkProps) {
  return (
    <StyledIconNavLink
      to={to}
      icon={icon}
      $decorateType={$decorateType}
      className={
        ({ isActive }) => (isActive ? 'active' : '') // NavLInk 에만 존재하는 isActive 속성
      }
      {...rest}
    />
  )
}
export default MenuItemNavLink

// Inner Components

const StyledIconNavLink = styled(IconNavLink)<MenuItemLinkProps>`
  ${({ $decorateType }) => $decorateType && decorateStyles[$decorateType]}
`