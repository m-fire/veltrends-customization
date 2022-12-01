import { FormEventHandler, ReactNode } from 'react'
import styled from 'styled-components'
import Button from '../../../common/component/system/Button'
import { colors } from '~/common/style/colors'
import { flexStyles, fontStyles } from '~/common/style/styled'

type WriteFormTemplateProps = {
  description?: string
  buttonText: string
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

function WriteFormTemplate({
  description,
  buttonText,
  onSubmit,
  children,
}: WriteFormTemplateProps) {
  return (
    <StyledForm onSubmit={onSubmit}>
      {description ? <h3>{description}</h3> : null}
      <Content>{children}</Content>
      <Button>{buttonText}</Button>
    </StyledForm>
  )
}
export default WriteFormTemplate

// Inner Components

const StyledForm = styled.form`
  ${flexStyles({ direction: 'column', flex: 1 })};
  padding: 16px 20px 24px;

  h3 {
    ${fontStyles({ size: '18px', color: colors.grey5, lineHeight: 1.5 })};
    margin-top: 0;
    margin-bottom: 16px;
  }
`

const Content = styled.section`
  ${flexStyles({ direction: 'column', flex: 1 })};
`
