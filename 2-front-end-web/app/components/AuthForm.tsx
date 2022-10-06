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
        <InputGroup>
          <LabelInput label="아이디" />
          <LabelInput label="비밀번호" />
        </InputGroup>
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

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; // 사용주의! 구형브라우저 적용불가
`
