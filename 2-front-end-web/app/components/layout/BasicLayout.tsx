import React, { ReactNode } from 'react'
import FullHeightPage from '~/components/system/FullHeightPage'
import Header from '~/components/base/Header'
import HeaderBackButton from '~/components/base/HeaderBackButton'
import { useGoBack } from '~/common/hooks/useGoBack'
import styled from 'styled-components'

type BasicLayoutProps = {
  title?: ReactNode
  hasBackButton?: boolean
  onGoBack?: () => void
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
  children,
}: BasicLayoutProps) {
  const goBack = useGoBack()

  return (
    <FullHeightPage>
      <Header
        title={title}
        headerLeft={
          hasBackButton ? (
            <HeaderBackButton onClick={onGoBack ?? goBack} />
          ) : null
        }
      />
      <Content>{children}</Content>
    </FullHeightPage>
  )
}
export default BasicLayout

// Inner Components

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: scroll;
`
