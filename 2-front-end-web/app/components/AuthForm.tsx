import React from 'react'
import styled from 'styled-components'
import LabelInput from '~/components/LabelInput'

type AuthFormProps = {
  mode: 'login' | 'register'
}

function AuthForm({ mode }: AuthFormProps) {
  return (
    <>
      <Block>
        <LabelInput label="아이디" />
        <LabelInput label="비밀번호" />
      </Block>
    </>
  )
}
export default AuthForm

// Inner Components

const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
`
