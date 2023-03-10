import React, { useEffect } from 'react'
import styled from 'styled-components'
import LabelInput from '~/core/component/LabelInput'
import VariantLinkOrButton from '~/core/component/VariantLinkOrButton'
import QuestionLink from '~/core/component/auth/QuestionLink'
import { Form, Link, useSearchParams } from '@remix-run/react'
import { useSubmitLoading } from '~/common/hook/useSubmitLoading'
import { Key, LogoVeltrend, Write } from '~/core/component/generate/svg'
import AppError from '~/common/error/AppError'
import { appColors } from '~/core/style/app-colors'
import { useFormValidation } from '~/common/hook/useFormValidation'
import { Validator } from '~/common/util/validates'
import { Flex, Font } from '~/common/style/css-builder'
import { RoutePath } from '~/common/api/client'
import { Media } from '~/common/style/media-query'
import Spinner from '~/core/component/Spinner'

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
      <StyledForm method="post" onSubmit={onSubmit}>
        <DesktopLogoLink to="/">
          <LogoVeltrend />
        </DesktopLogoLink>

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

          <StyledVariantLinkButton
            type="submit"
            layout="fullWidth"
            disabled={isLoading}
          >
            <span>{isLoading ? <Spinner /> : submitBtnByMode.icon}</span>
            {submitBtnByMode.text}
          </StyledVariantLinkButton>

          <QuestionLink
            question={actionByMode.question}
            name={actionByMode.name}
            to={
              next
                ? (`${actionByMode.link}?next=${next}` as RoutePath)
                : actionByMode.link
            }
            disabled={isLoading}
          />
        </ActionBox>
      </StyledForm>
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

const StyledForm = styled(Form)`
  ${Flex.item().flex(1).create()};
  ${Flex.container()
    .direction('column')
    .justifyContent('space-between')
    .create()};
  padding-top: 16px;
  padding-bottom: 16px;

  ${Media.minWidth.mobile} {
    ${Flex.item().alignSelf('center').create()};
    ${Flex.container().justifyContent('center').create()}
    width: 460px;
    padding-left: 72px;
    padding-right: 72px;
    padding-bottom: 56px;
  }
`

const DesktopLogoLink = styled(Link)`
  ${Media.maxWidth.mobile} {
    display: none;
  }
  ${Flex.container().justifyContent('center').create()};
  margin-bottom: 32px;
  svg {
    width: auto;
    height: 48px;
    color: ${appColors.primary1};
  }
`

const InputGroup = styled.div`
  ${Flex.container().direction('column').create()};
  gap: 16px; // 사용주의! 구형브라우저 적용불가
`

// Footer 대용
const ActionBox = styled.div`
  ${Flex.container().direction('column').alignItems('center').create()};
  width: 100%;
  gap: 24px;

  ${Media.minWidth.mobile} {
    // form 에서 로긴/회원가입 버튼의 거리
    margin-top: 56px;
  }
`

const StyledVariantLinkButton = styled(VariantLinkOrButton)`
  & span {
    padding-right: 6px;
  }
  svg {
    width: 20px;
    height: 20px;
  }
`

const ActionErrorMessage = styled.div`
  ${Font.style()
    .size(14)
    .color(appColors.secondary1)
    .textAlign('center')
    .create()};
`
