import React, { useEffect } from 'react'
import styled from 'styled-components'
import LabelInput from '~/components/system/LabelInput'
import Button from '~/components/system/Button'
import QuestionLink from '~/components/auth/QuestionLink'
import { Form, useSearchParams } from '@remix-run/react'
import { useSubmitLoading } from '~/common/hooks/useSubmitLoading'
import { Key, Write } from '~/components/generate/svg'
import AppError from '~/common/error/AppError'
import { colors } from '~/common/style/colors'
import { useFormValidation } from '~/common/hooks/useFormValidation'
import { Validator } from '~/common/util/validates'

type AuthFormProps = {
  mode: 'login' | 'register'
  error?: AppError
}

function AuthForm({ mode, error }: AuthFormProps) {
  const {
    inputProps,
    handleSubmit,
    errors: formErrors,
    setError,
  } = useFormValidation({
    form: {
      username: {
        validate: mode === 'register' ? Validator.Auth.usrename : undefined,
        errorMessage: '5~20자 사이의 영문 대/소문자, 숫자를 입력해주세요',
      },
      password: {
        validate: mode === 'register' ? Validator.Auth.password : undefined,
        errorMessage: '8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력해주세요',
      },
    },
    mode: 'all', // change | blue 모두
    shouldPreventDefault: false,
  })

  const {
    placeholder: placeholderByMode,
    submitButton: submitBtnByMode,
    action: actionByMode,
  } = formDescriptions[mode]
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next')
  const isLoading = useSubmitLoading()
  const onSubmit = handleSubmit((values) => {
    // console.log(`AuthForm.onSubmit() { handleSubmit values :`, values)
  })

  useEffect(() => {
    if (error == null) return
    let message: string
    switch (error.name) {
      case 'UserExists':
        message = '이미 존재하는 계정입니다.'
        break
      case 'Authentication':
        message = '+입력정보를 다시 확인해주세요'
        break
      case 'Unknown':
        message = '-입력정보를 다시 확인해주세요'
        break
      default:
        message = error.message
    }
    setError('username', message)
  }, [error, setError])

  return (
    <>
      <StyledFormRef method="post" onSubmit={onSubmit}>
        <InputGroup>
          <LabelInput
            label="아이디"
            placeholder={placeholderByMode.username}
            disabled={isLoading}
            errorMessage={formErrors.username}
            {...inputProps.username}
          />

          <LabelInput
            type="password"
            label="비밀번호"
            placeholder={placeholderByMode.password}
            disabled={isLoading}
            errorMessage={formErrors.password}
            {...inputProps.password}
          />
        </InputGroup>

        <ActionBox>
          {error?.name === 'Authentication' ? (
            <ActionErrorMessage>잘못된 계정정보 입니다.</ActionErrorMessage>
          ) : null}

          <StyledButton
            type="submit"
            layoutMode="fullWidth"
            disabled={isLoading}
          >
            <span>{submitBtnByMode.icon}</span>
            {submitBtnByMode.text}
          </StyledButton>

          <QuestionLink
            question={actionByMode.question}
            name={actionByMode.name}
            to={next ? `${actionByMode.link}?next=${next}` : actionByMode.link}
            disabled={isLoading}
          />
        </ActionBox>
      </StyledFormRef>
    </>
  )
}
export default AuthForm

const formDescriptions = {
  register: {
    placeholder: {
      username: '5~20자 영문, 숫자 입력',
      password: '8자이상 영문,숫자,특수문자 중 2가지 혼합입력',
    },
    submitButton: {
      icon: <Write />,
      text: '회원가입',
    },
    action: {
      question: '이미 계정이 있으신가요?',
      name: '로그인',
      link: '/auth/login',
    },
  },
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
      name: '회원가입',
      link: '/auth/register',
    },
  },
} as const

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

const StyledButton = styled(Button)`
  svg {
    width: 20px;
    height: 20px;
  }
`

const ActionErrorMessage = styled.div`
  text-align: center;
  color: ${colors.secondary1};
  font-size: 14px;
`
