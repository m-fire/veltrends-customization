import React from 'react'
import styled from 'styled-components'
import { RoutePath } from '~/common/api/client'
import IconNavLink, {
  IconNavLinkProps,
} from '~/common/component/atom/IconNavLink'
import { decorateStyles, PseudoThemeType } from '~/core/style/decorate-styles'
import { appColors } from '~/core/style/app-colors'
import { Filters } from '~/common/style/css-builder'

export type FooterMenuItemProps = {
  to: RoutePath
  icon: IconNavLinkProps['icon']
  decorate?: PseudoThemeType
}

function FooterMenuItem({ to, icon, decorate, ...rest }: FooterMenuItemProps) {
  return (
    <StyledIconNavLink
      to={to}
      icon={icon}
      decorate={decorate}
      className={
        ({ isActive }) => (isActive ? 'active' : '') // NavLInk 에만 존재하는 isActive 속성
      }
      {...rest}
    />
  )
}
export default FooterMenuItem

// Inner Components

const StyledIconNavLink = styled(IconNavLink)<FooterMenuItemProps>`
  & svg {
    width: auto;
    height: 24px;
    ${Filters.filter()
      .dropShadow(0, 0, 0.5, 'white')
      .dropShadow(0, 0, 0.5, 'white')
      .dropShadow(0, 0, 0.5, 'white')
      .create()};
  }
  ${({ decorate }) => decorate && decorateStyles[decorate]};
  &.active {
    svg {
      color: ${appColors.primary1};
    }
  }
`
