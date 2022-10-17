import { FormEventHandler, ReactNode } from 'react'
import styled from 'styled-components'
import Button from '../system/Button'
import { colors } from '~/common/style/colors'

type WriteFormTemplateProps = {
  description: string
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
      <h3>{description}</h3>
      <Content>{children}</Content>
      <Button>{buttonText}</Button>
    </StyledForm>
  )
}
export default WriteFormTemplate

// Inner Components

const StyledForm = styled.form`
  flex: 1;
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;

  h3 {
    color: ${colors.grey5};
    line-height: 1.5;
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 16px;
  }
`

const Content = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
`
