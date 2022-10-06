import React from 'react'
import styled from 'styled-components'
import LabelInput from '~/components/LabelInput'

type AuthFormProps = {
  mode: 'login' | 'register'
}

function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === 'register'
  return (
    <>
      <Block>
        <InputGroup>
          <LabelInput
            label="아이디"
            placeholder={
              isRegister ? '5~20자 영문, 숫자 입력' : '아이디를 입력하세요'
            }
          />
          <LabelInput
            label="비밀번호"
            placeholder={
              isRegister
                ? '8자 이상 영문, 숫자, 특수문자 중 2가지 이상 입력'
                : '비밀번호를 입력하세요'
            }
          />
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
