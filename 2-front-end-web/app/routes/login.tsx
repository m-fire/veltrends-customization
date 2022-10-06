import React from 'react'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'
import { useGoBack } from '~/routes/useGoBack'
import FullHeightPage from '~/components/FullHeightPage'
import AuthForm from '~/components/AuthForm'

type LoginProps = {}

function Login({}: LoginProps) {
  const goBack = useGoBack()

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
