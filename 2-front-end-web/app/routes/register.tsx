import React from 'react'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'
import { useGoBack } from '~/routes/useGoBack'
import FullHeightPage from '~/components/FullHeightPage'
import AuthForm, { AuthFormSumitData } from '~/components/AuthForm'
import { ActionFunction, json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'

type RegisterProps = {}

function Register({}: RegisterProps) {
  const goBack = useGoBack()
  const actionData = useActionData<AuthFormSumitData>()
  console.log(`register.Register() actionData:`, actionData)

  return (
    <FullHeightPage>
      <Header
        title="회원가입"
        headerLeft={<HeaderBackButton onClick={goBack} />}
        headerRight="HR"
      />
      <AuthForm mode="register" />
    </FullHeightPage>
  )
}

export default Register

// Remix actions handler

export const action: ActionFunction = async ({ request }) => {
  /* Todo: Remix 의 route 모듈 root 에 `action` 이름의 비동기 함수를
           export 하는것으로 useActionData() 를 통해 데이터 핸들링 할 수 있다 */

  // handle form data
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')

  // submit 액션발생 시 3초지연처리 테스트코드
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Remix action result
  return json({ username, password })
}
