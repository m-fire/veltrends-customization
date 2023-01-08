import React, { ReactNode } from 'react'
import FullHeightBlock from '~/common/component/atom/FullHeightBlock'
import HeaderMobile from '~/common/component/element/HeaderMobile'
import HeaderBackButton from '~/common/component/atom/HeaderBackButton'
import { useGoBack } from '~/common/hook/useGoBack'
import ContentBlock from '~/common/component/template/ContentBlock'
import styled from 'styled-components'
import { Filters } from '~/common/style/css-builder'

type BasicLayoutProps = {
  title?: ReactNode
  hasBackButton?: boolean
  onGoBack?: () => void
  headerRight?: ReactNode
  children?: ReactNode
}

/**
 * Shows content with a header.
 * Header might contian back button.
 * Header might contain title.
 */
function BasicLayout({
  title,
  hasBackButton,
  onGoBack,
  headerRight,
  children,
}: BasicLayoutProps) {
  const goBack = useGoBack()

  return (
    <FullHeightBlock>
      <StyledHeader
        title={title}
        headerLeft={
          hasBackButton ? (
            <HeaderBackButton onClick={onGoBack ?? goBack} />
          ) : null
        }
        headerRight={headerRight}
      />
      <ContentBlock>{children}</ContentBlock>
    </FullHeightBlock>
  )
}
export default BasicLayout

// Inner Components

const StyledHeader = styled(HeaderMobile)`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  ${Filters.backdrop().blur(8).create()};
`
