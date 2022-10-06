import React from 'react'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'
import { useGoBack } from '~/routes/useGoBack'
import FullHeightPage from '~/components/FullHeightPage'
import AuthForm from '~/components/AuthForm'

type RegisterProps = {}

function Register({}: RegisterProps) {
  const goBack = useGoBack()

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

// Sub Comps
