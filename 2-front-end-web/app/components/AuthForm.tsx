import React from 'react'
import styled from 'styled-components'
import LabelInput from '~/components/LabelInput'
import Button from '~/components/Button'

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

        <ActionBox>
          <Button
            layoutMode="fullWith"
            backgroundColor={isRegister ? 'grey4' : undefined}
          >
            {isRegister ? '회원가입' : '로그인'}
          </Button>
        </ActionBox>
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
  flex: 1;
  justify-content: space-between;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; // 사용주의! 구형브라우저 적용불가
`

// Footer 대용
const ActionBox = styled.div`
  width: 100%;
`
