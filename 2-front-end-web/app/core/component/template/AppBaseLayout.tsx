import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useGoBack } from '~/common/hook/useGoBack'
import FullHeightLayout from '~/common/component/template/FullHeightLayout'
import HeaderMobile from '~/common/component/element/HeaderMobile'
import { Filters, Flex } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'
import MobileBackButton from '~/core/component/atom/MobileBackButton'

type AppBasicLayoutProps = {
  title?: ReactNode
  onGoBack?: () => void
  headerRight?: ReactNode
  hasBackButton?: boolean
  className?: string
  children?: ReactNode
}

/**
 * Shows content with a header.
 * Header might contain back button.
 * Header might contain title.
 */
function AppBaseLayout({
  title,
  onGoBack,
  headerRight,
  className,
  children,
}: AppBasicLayoutProps) {
  const goBack = useGoBack()

  return (
    <FullHeightLayout
      header={
        <StyledHeader
          title={title}
          headerLeft={<MobileBackButton onClick={onGoBack ?? goBack} />}
          headerRight={headerRight}
        />
      }
      footer={null}
    >
      <Content className={className}>{children}</Content>
    </FullHeightLayout>
  )
}
export default AppBaseLayout

// Inner Components
const StyledHeader = styled(HeaderMobile)`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  ${Filters.backdrop().blur(8).create()};
`

const Content = styled.div`
  ${Flex.Item.flex1};
  ${Flex.Container.style().direction('column').create()};
  padding-top: 56px;
  overflow: scroll;
  padding-left: 30px;
  padding-right: 30px;
  ${Media.minWidth.wide} {
    width: 1280px; // wide screen minWidth
    margin-left: auto;
    margin-right: auto;
  }
`
