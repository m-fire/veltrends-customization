import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useGoBack } from '~/common/hook/useGoBack'
import LayoutFullHeight from '../../common/component/template/LayoutFullHeight'
import HeaderMobile from '~/core/component/routes/home/HeaderMobile'
import { Filters, Flex } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'
import MobileBackButton from '~/core/component/routes/home/MobileBackButton'

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
function LayoutBase({
  title,
  onGoBack,
  headerRight,
  className,
  children,
}: AppBasicLayoutProps) {
  const goBack = useGoBack()

  return (
    <LayoutFullHeight
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
    </LayoutFullHeight>
  )
}
export default LayoutBase

// Inner Components
const StyledHeader = styled(HeaderMobile)`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  ${Filters.backdrop().blur(8).create()};
`

const Content = styled.div`
  ${Flex.Item.presets.flex1};
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
