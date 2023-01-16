import { FormEventHandler, ReactNode } from 'react'
import styled from 'styled-components'
import VariantLinkOrButton from '../VariantLinkOrButton'
import { globalColors } from '~/common/style/global-colors'
import { Flex, Font } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'

type WriteFormProps = {
  description?: string
  buttonText: string
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

function WriteForm({
  description,
  buttonText,
  onSubmit,
  children,
}: WriteFormProps) {
  return (
    <StyledForm onSubmit={onSubmit}>
      {description ? <h3>{description}</h3> : null}
      <Content>{children}</Content>
      <VariantLinkOrButton>{buttonText}</VariantLinkOrButton>
    </StyledForm>
  )
}
export default WriteForm

// Inner Components

const StyledForm = styled.form`
  ${Flex.item().flex(1).create()};
  ${Flex.container().direction('column').create()};
  ${Media.minWidth.mobile} {
    ${Flex.item().alignSelf('center').create()};
    ${Flex.container().justifyContent('center').create()}
    width: 460px;
    padding-left: 72px;
    padding-right: 72px;
  }
  padding: 16px 20px 24px;

  h3 {
    ${Font.style().size(18).color(globalColors.grey5).lineHeight(1.5).create()};
    margin-top: 0;
    margin-bottom: 16px;
  }
`

const Content = styled.section`
  ${Flex.item().flex(1).create()};
  ${Flex.container().direction('column').create()};
  ${Media.minWidth.mobile} {
    ${Flex.item().flex('initial').create()};
  }
`
