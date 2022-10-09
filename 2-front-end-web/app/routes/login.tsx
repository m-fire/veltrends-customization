import React from 'react'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'
import { useGoBack } from '~/hooks/useGoBack'
import FullHeightPage from '~/components/FullHeightPage'
import AuthForm, { AuthFormSumitData } from '~/components/AuthForm'
import { ActionFunction, json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { isString } from '~/common/util/strings'
import { login } from '~/common/api/auth'

type LoginProps = {}

function Login({}: LoginProps) {
  const goBack = useGoBack()
  const actionData = useActionData<AuthFormSumitData>()
  console.log(`login.Login() actionData:`, actionData)

  return (
    <FullHeightPage>
      <Header
        title="로그인"
        headerLeft={<HeaderBackButton onClick={goBack} />}
        headerRight="HR"
      />
      <AuthForm mode="login" />
    </FullHeightPage>
  )
}

export default Login

// Remix actions handler

export const action: ActionFunction = async ({ request }) => {
  /* Todo: Remix 의 route 모듈 root 에 `action` 이름의 비동기 함수를
           export 하는것으로 useActionData() 를 통해 데이터 핸들링 할 수 있다 */

  // handle form data
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')
  if (!isString(username) || !isString(password)) return

  const { result, headers } = await login({ username, password })

  return json(result, { headers })
}
