import React from 'react'
import Header from '~/components/base/Header'
import HeaderBackButton from '~/components/base/HeaderBackButton'
import { useGoBack } from '~/common/hooks/useGoBack'
import FullHeightPage from '~/components/system/FullHeightPage'
import AuthForm, { AuthFormSumitData } from '~/components/auth/AuthForm'
import { ActionFunction, json } from '@remix-run/node'
import { ThrownResponse, useActionData, useCatch } from '@remix-run/react'
import { isString } from '~/common/util/strings'
import { register } from '~/common/api/auth'
import AppError from '~/common/error/AppError'

type RegisterProps = {
  error?: AppError
}

function Register({ error }: RegisterProps) {
  const goBack = useGoBack()
  const actionData = useActionData<AuthFormSumitData>()
  // console.log(`register.Register() actionData:`, actionData)

  return (
    <FullHeightPage>
      <Header
        title="회원가입"
        headerLeft={<HeaderBackButton onClick={goBack} />}
      />
      <AuthForm mode="register" error={error} />
    </FullHeightPage>
  )
}

export default Register

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, AppError>>()
  console.log(`register.CatchBoundary() caught:`, caught)

  return <Register error={caught.data} />
}

// Remix actions handler

export const action: ActionFunction = async ({ request }) => {
  /* Todo: Remix 의 route 모듈 root 에 `action` 이름의 비동기 함수를
           export 하는것으로 useActionData() 를 통해 데이터 핸들링 할 수 있다 */

  // handle form data
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')
  if (!isString(username) || !isString(password)) return

  try {
    const { result, headers } = await register({ username, password })
    return json(result, { headers })
  } catch (e) {
    const error = AppError.extract(e)
    throw json(error, {
      status: error.statusCode,
    })
  }
}
