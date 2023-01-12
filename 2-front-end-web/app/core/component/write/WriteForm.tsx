import { FormEventHandler, ReactNode } from 'react'
import styled from 'styled-components'
import VariantLinkButton from '../VariantLinkButton'
import { globalColors } from '~/common/style/global-colors'
import { Flex, Font } from '~/common/style/css-builder'

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
      <VariantLinkButton>{buttonText}</VariantLinkButton>
    </StyledForm>
  )
}
export default WriteForm

// Inner Components

const StyledForm = styled.form`
  ${Flex.Item.presets.flex1};
  ${Flex.Container.style().direction('column').create()};
  padding: 16px 20px 24px;

  h3 {
    ${Font.style()
      .size('18px')
      .color(globalColors.grey5)
      .lineHeight(1.5)
      .create()};
    margin-top: 0;
    margin-bottom: 16px;
  }
`

const Content = styled.section`
  ${Flex.Item.presets.flex1};
  ${Flex.Container.style().direction('column').create()};
`
