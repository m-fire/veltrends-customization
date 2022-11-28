import React, { ReactNode } from 'react'
import FullHeightPage from '~/common/component/system/FullHeightPage'
import Header from '~/common/component/base/Header'
import HeaderBackButton from '~/common/component/base/HeaderBackButton'
import { useGoBack } from '~/common/hook/useGoBack'
import styled from 'styled-components'
import { flexStyles } from '~/common/style/styled'

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
  ${flexStyles({ direction: 'column', flex: 1 })};
  overflow: scroll;
`
