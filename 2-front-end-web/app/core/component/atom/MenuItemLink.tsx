import React, { ReactElement, ReactFragment, ReactPortal } from 'react'
import styled from 'styled-components'
import { RoutePath } from '~/common/api/client'
import IconNavLink from '~/common/component/atom/IconNavLink'
import { pseudoStyles, PseudoThemeType } from '~/core/style/pseudo-styles'
import { appColors } from '~/core/style/app-colors'

export type MenuItemLinkProps = {
  to: RoutePath
  icon: ReactElement | ReactFragment | ReactPortal
  decorateType?: PseudoThemeType
}

function MenuItemLink({ to, icon, decorateType, ...rest }: MenuItemLinkProps) {
  return (
    <StyledIconNavLink
      to={to}
      icon={icon}
      decorateType={decorateType}
      {...rest}
    />
  )
}
export default MenuItemLink

// Inner Components

const StyledIconNavLink = styled(IconNavLink)<MenuItemLinkProps>`
  ${({ decorateType }) => decorateType && pseudoStyles[decorateType]}
  color: ${appColors.primary1}
`
