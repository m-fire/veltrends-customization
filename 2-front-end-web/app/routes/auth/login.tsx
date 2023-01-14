import React from 'react'
import AuthForm from '~/core/component/auth/AuthForm'
import { ActionFunction, json } from '@remix-run/node'
import { ThrownResponse, useCatch } from '@remix-run/react'
import { isString } from '~/common/util/strings'
import { Authenticator } from '~/core/api/auth'
import AppError from '~/common/error/AppError'
import BasicLayout from '~/core/component/home/BasicLayout'
import { useAuthRedirect } from '~/common/hook/useAuthRedirect'

type LoginProps = {
  error?: AppError
}

//Todo: 로그인폼 UI는 디바이스 스크린사이즈에 따라 너비 폭 줄이거나 키움
function Login({ error }: LoginProps) {
  useAuthRedirect()

  return (
    <BasicLayout title="로그인" hasBackButton>
      <AuthForm mode="login" error={error} />
    </BasicLayout>
  )
}

export default Login

// Remix actions handler

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, AppError>>()
  console.log(`login.CatchBoundary() caught:`, caught)

  return <Login error={caught.data} />
}

export const action: ActionFunction = async ({ request }) => {
  /* Todo: Remix 의 route 모듈 root 에 `action` 이름의 비동기 함수를
           export 하는것으로 useActionData() 를 통해 데이터 핸들링 할 수 있다 */

  /* Todo: 사용자가 로그인 후, 인증이 되었다면 home 으로 이동 */

  // handle form data
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')
  if (!isString(username) || !isString(password)) return

  try {
    const { result, headers } = await Authenticator.Route.login({
      username,
      password,
    })
    return json(result, { headers })
  } catch (e) {
    const error = AppError.extract(e)
    throw json(error, {
      status: error.statusCode,
    })
  }
}
