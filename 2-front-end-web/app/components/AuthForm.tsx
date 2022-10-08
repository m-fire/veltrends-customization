import React from 'react'
import styled from 'styled-components'
import LabelInput from '~/components/LabelInput'
import Button from '~/components/Button'
import QuestionLink from '~/components/QuestionLink'
import { Form } from '@remix-run/react'
import { useFormDataIsLoading } from '~/hooks/useFormDataIsLoading'
import { Key, Write } from '~/components/generate'

const formDescriptions = {
  login: {
    placeholder: {
      username: '아이디를 입력하세요',
      password: '비밀번호를 입력하세요',
    },
    submitButton: {
      icon: <Key />,
      text: '로그인',
    },
    action: {
      question: '계정이 없으신가요?',
      name: '가입',
      link: '/register',
    },
  },
  register: {
    placeholder: {
      username: '5~20자 영문, 숫자 입력',
      password: '8자 이상 영문, 숫자, 특수문자 중 2가지 이상 입력',
    },
    submitButton: {
      icon: <Write />,
      text: '회원가입',
    },
    action: {
      question: '이미 계정이 있으신가요?',
      name: '로그인',
      link: '/login',
    },
  },
} as const

export type AuthFormSumitData = {
  username: string
  password: string
}

type AuthFormProps = {
  mode: 'login' | 'register'
}

function AuthForm({ mode }: AuthFormProps) {
  const isLoading = useFormDataIsLoading()

  const { placeholder, submitButton, action } = formDescriptions[mode]

  return (
    <>
      <StyledFormRef method="post">
        <InputGroup>
          <LabelInput
            name="username"
            label="아이디"
            placeholder={placeholder.username}
            disabled={isLoading}
          />
          <LabelInput
            name="password"
            label="비밀번호"
            placeholder={placeholder.password}
            disabled={isLoading}
          />
        </InputGroup>

        <ActionBox>
          <Button type="submit" layoutMode="fullWith" disabled={isLoading}>
            <span>{submitButton.icon}</span>
            {submitButton.text}
          </Button>
          <QuestionLink
            question={action.question}
            name={action.name}
            to={action.link}
            disabled={isLoading}
          />
        </ActionBox>
      </StyledFormRef>
    </>
  )
}
export default AuthForm

// Inner Components

const StyledFormRef = styled(Form)`
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`
