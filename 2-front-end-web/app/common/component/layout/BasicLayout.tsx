import React, { ReactNode } from 'react'
import FullHeightPage from '~/common/component/system/FullHeightPage'
import Header from '~/common/component/base/Header'
import HeaderBackButton from '~/common/component/base/HeaderBackButton'
import { useGoBack } from '~/common/hook/useGoBack'
import LayoutContent from '~/common/component/layout/LayoutContent'
import styled from 'styled-components'

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
    <FullHeightPage>
      <StyledHeader
        title={title}
        headerLeft={
          hasBackButton ? (
            <HeaderBackButton onClick={onGoBack ?? goBack} />
          ) : null
        }
        headerRight={headerRight}
      />
      <LayoutContent>{children}</LayoutContent>
    </FullHeightPage>
  )
}
export default BasicLayout

// Inner Components

const StyledHeader = styled(Header)`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  backdrop-filter: blur(8px); // grayscale(80%)
  -webkit-backdrop-filter: blur(8px); // grayscale(80%)
`
